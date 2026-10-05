from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class CaseBase(BaseModel):
    title: str

class CaseCreate(CaseBase):
    pass

class CaseResponse(CaseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
