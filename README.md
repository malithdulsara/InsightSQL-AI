# 🤖 InsightSQL AI - Enterprise NL-to-SQL Gateway

InsightSQL AI is a modern, full-stack enterprise data gateway that allows users to query relational databases using pure Natural Language. By leveraging the power of Large Language Models (LLMs) and AI orchestration, this application seamlessly translates English questions into optimized, executable SQL queries, securely fetches the data, and presents it in a premium dashboard UI.

## ✨ Key Features
* **Natural Language to SQL:** Instantly compile validated SQL queries from plain English prompts using LangChain and Llama 3.1 (via Groq API).
* **Enterprise-Grade Security:** Implemented with a Read-Only Database User architecture to strictly prevent unauthorized data manipulation (No DROP, DELETE, or UPDATE capabilities).
* **Dynamic Relational Data Presentation:** Automatically handles varying table schemas and dynamically renders headers and rows in the frontend.
* **Modern Premium UI:** Built with React, featuring a clean, minimalist "Light Mode" aesthetic, responsive layouts, and Framer Motion micro-interactions.
* **Full-Stack Architecture:** Decoupled FastAPI backend and Vite-React frontend for high performance and scalability.

## 🛠️ Technology Stack
**Frontend:**
* React (Vite)
* Bootstrap & Custom CSS (Modern Light Theme)
* Framer Motion (Animations)
* Lucide React (Icons)
* Axios (API calls)

**Backend:**
* Python (FastAPI)
* LangChain Core & Community (AI Orchestration)
* Groq API (Llama 3.1 Model)
* SQLAlchemy (Database Execution Engine)
* MySQL (Database)

## 🚀 How to Run Locally

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment: `python -m venv venv` and `venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file and add your database credentials and `GROQ_API_KEY`.
5. Run the FastAPI server: `uvicorn app.main:app --reload`

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---
*Built with ❤️ for modern data exploration.*
