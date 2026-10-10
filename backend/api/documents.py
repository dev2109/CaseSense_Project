from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.base import Case, Document, DocumentChunk
from schemas.document import DocumentResponse
from services.document_service import extract_text_from_txt, extract_text_from_pdf

router = APIRouter(prefix="/cases/{case_id}/documents", tags=["Documents"])

@router.get("/", response_model=List[DocumentResponse])
def get_documents(case_id: str, db: Session = Depends(get_db)):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return db.query(Document).filter(Document.case_id == case_id).order_by(Document.created_at.desc()).all()

@router.post("/", response_model=DocumentResponse)
async def upload_document(case_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Validate Case
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    filename = file.filename or "unknown"
    file_extension = filename.lower().split(".")[-1]
    
    if file_extension not in ["txt", "pdf"]:
        raise HTTPException(status_code=400, detail="Only .txt and .pdf files are supported")
        
    # Create Document record as pending
    db_doc = Document(
        case_id=case_id,
        filename=filename,
        file_type=file_extension,
        status="processing"
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    try:
        # Read file
        file_bytes = await file.read()
        
        # Extract text
        extracted_text = ""
        if file_extension == "txt":
            extracted_text = extract_text_from_txt(file_bytes)
        elif file_extension == "pdf":
            extracted_text = extract_text_from_pdf(file_bytes)
            
        if not extracted_text.strip():
            raise ValueError("File is empty or contains no extractable text.")
            
        # For Stage 5, we chunk the document and create embeddings.
        from services.chunking import chunk_text
        from services.ai_provider import get_ai_provider
        import json
        
        ai = get_ai_provider()
        chunks = chunk_text(extracted_text, chunk_size=1000, overlap=200)
        
        for i, chunk_text_content in enumerate(chunks):
            embedding = ai.get_embedding(chunk_text_content)
            chunk_record = DocumentChunk(
                document_id=db_doc.id,
                chunk_order=i,
                extracted_text=chunk_text_content,
                page_number=1, # Placeholder for now
                embedding=json.dumps(embedding)
            )
            db.add(chunk_record)
        
        db_doc.status = "completed"
        
    except Exception as e:
        db_doc.status = "error"
        db_doc.error_message = str(e)
        
    db.commit()
    db.refresh(db_doc)
    
    return db_doc

@router.delete("/{document_id}", status_code=204)
def delete_document(case_id: str, document_id: str, db: Session = Depends(get_db)):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    db_doc = db.query(Document).filter(Document.id == document_id, Document.case_id == case_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    db.delete(db_doc)
    db.commit()
    return None
