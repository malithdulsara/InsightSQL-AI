import os
from dotenv import load_dotenv
import ast
from sqlalchemy import text

from langchain_community.utilities import SQLDatabase
from langchain_community.tools.sql_database.tool import QuerySQLDatabaseTool
from langchain_classic.chains import create_sql_query_chain
from langchain_groq import ChatGroq

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, "../.env")

load_dotenv(dotenv_path=env_path)

db_user = os.getenv("DB_USER", "root")
db_password = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "3306")
db_name = os.getenv("DB_NAME", "text_to_sql_db")

DATABASE_URI = (
    f"mysql+pymysql://{db_user}:{db_password}"
    f"@{db_host}:{db_port}/{db_name}"
)


db = SQLDatabase.from_uri(DATABASE_URI)

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    temperature=0
)

sql_generation_chain = create_sql_query_chain(llm, db)

db_execution_tool = QuerySQLDatabaseTool(db=db)

def ask_database(question: str):
    try:
        generated_sql = sql_generation_chain.invoke({
            "question": question
        })

        cleaned_sql = generated_sql
        if "SQLQuery:" in cleaned_sql:
            cleaned_sql = cleaned_sql.split("SQLQuery:")[-1]
        if "SQLResult:" in cleaned_sql:
            cleaned_sql = cleaned_sql.split("SQLResult:")[0]
        
        cleaned_sql = cleaned_sql.strip()
        print("\nCleaned SQL:")
        print(cleaned_sql)

        with db._engine.connect() as connection:
            result = connection.execute(text(cleaned_sql))
            column_names = list(result.keys())
            rows = [list(row) for row in result.fetchall()]

        return {
            "columns": column_names,
            "data": rows
        }

    except Exception as e:
        return {"error": str(e)}

# TESTING
if __name__ == "__main__":

    test_question = "Show all products"

    print(f"Question: {test_question}")

    result = ask_database(test_question)

    print("\n--- Result ---")
    print(result)

