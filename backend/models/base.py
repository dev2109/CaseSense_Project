import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from core.database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="case", cascade="all, delete-orphan")
    question_answers = relationship("QuestionAnswer", back_populates="case", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="pending") # pending, processing, completed, error
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_order = Column(Integer, nullable=False)
    extracted_text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    embedding = Column(Text, nullable=True) # Storing as JSON string for simple numpy operations later

    document = relationship("Document", back_populates="chunks")

class QuestionAnswer(Base):
    __tablename__ = "question_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    citations = Column(Text, nullable=True) # Storing citations as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="question_answers")
