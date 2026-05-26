from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.ai_chain import ask_database

app = FastAPI(title="Text-to-SQL AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "Text-to-SQL AI Backend එක සාර්ථකව වැඩ කරයි!"}

@app.post("/api/chat")
async def chat_with_db(request: ChatRequest):
   
    user_question = request.question
    
    db_result = ask_database(user_question)

    return {
        "status": "success",
        "question": user_question,
        "data": db_result
    }