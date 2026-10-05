from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine
from models import base
from api import cases, documents, qa

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for CaseSense - A document search and review assistant.",
    version="0.1.0",
)

app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(qa.router)

# Configure CORS
origins = [
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
