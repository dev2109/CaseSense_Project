from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import numpy as np

from core.database import get_db
from models.base import Case, DocumentChunk, QuestionAnswer
from pydantic import BaseModel
from services.ai_provider import get_ai_provider

router = APIRouter(prefix="/cases/{case_id}/qa", tags=["QA"])

class QuestionRequest(BaseModel):
    question: str

class QAResponse(BaseModel):
    id: str
    question: str
    answer: str
    citations: List[str]

def cosine_similarity(a: List[float], b: List[float]) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@router.post("/", response_model=QAResponse)
def ask_question(case_id: str, req: QuestionRequest, db: Session = Depends(get_db)):
    # 1. Verify Case
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    ai = get_ai_provider()
    
    # 2. Get question embedding
    try:
        q_embedding = ai.get_embedding(req.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Provider error: {str(e)}")
        
    # 3. Retrieve chunks for THIS CASE ONLY
    chunks = db.query(DocumentChunk).join(DocumentChunk.document).filter(
        DocumentChunk.document.has(case_id=case_id)
    ).all()
    
    if not chunks:
        # No documents to answer from
        answer = "I couldn't find that in the uploaded documents (no documents uploaded)."
        citations = []
    else:
        # 4. Rank chunks by similarity
        chunk_scores = []
        for c in chunks:
            if c.embedding:
                try:
                    c_emb = json.loads(c.embedding)
                    score = cosine_similarity(q_embedding, c_emb)
                    chunk_scores.append((score, c))
                except Exception:
                    pass
                    
        # Sort descending by score and take top K (e.g., top 5)
        chunk_scores.sort(key=lambda x: x[0], reverse=True)
        top_chunks = chunk_scores[:5]
        
        # Prepare context for the LLM
        context_data = [
            {"chunk_id": str(score_chunk[1].id), "text": score_chunk[1].extracted_text}
            for score_chunk in top_chunks
        ]
        
        # 5. Generate Answer
        result = ai.generate_answer(req.question, context_data)
        answer = result.get("answer", "")
        citations = result.get("citations", [])
        
    # 6. Save QA history
    db_qa = QuestionAnswer(
        case_id=case_id,
        question=req.question,
        answer=answer,
        citations=json.dumps(citations)
    )
    db.add(db_qa)
    db.commit()
    db.refresh(db_qa)
    
    return QAResponse(
        id=str(db_qa.id),
        question=db_qa.question,
        answer=db_qa.answer,
        citations=citations
    )

@router.get("/", response_model=List[QAResponse])
def get_qa_history(case_id: str, db: Session = Depends(get_db)):
    history = db.query(QuestionAnswer).filter(QuestionAnswer.case_id == case_id).order_by(QuestionAnswer.created_at.asc()).all()
    
    responses = []
    for h in history:
        cits = []
        if h.citations:
            try:
                cits = json.loads(h.citations)
            except:
                pass
        responses.append(QAResponse(
            id=str(h.id),
            question=h.question,
            answer=h.answer or "",
            citations=cits
        ))
        
    return responses
