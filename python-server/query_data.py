import os
from fastapi import FastAPI, HTTPException, Query
import uvicorn # type: ignore
from dotenv import load_dotenv # type: ignore
from langchain_chroma import Chroma # type: ignore
from langchain_google_genai import ChatGoogleGenerativeAI # type: ignore 
from langchain_huggingface import HuggingFaceEmbeddings  # type: ignore
from langchain_core.prompts import ChatPromptTemplate # type: ignore
from langchain_core.load import dumpd # type: ignore
import chromadb # type: ignore

load_dotenv()

CHROMA_HOST = "localhost"
CHROMA_PORT = 8000
COLLECTION_NAME = "my-rag-collection"
PROMPT_TEMPLATE = """

{query_text}

You are an AI assistant providing helpful answers to users' questions based on the provided context.
Use only the information provided in the context to answer the question. If the context does not contain the answer, respond with "I'm sorry, I couldn't find any relevant information to answer your question."

Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

try:
    print("Initializing HuggingFace Embeddings...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Initializing Google Generative AI model...")
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.environ["GOOGLE_API_KEY"],
        temperature=0.3
    )
    
    print(f"Connecting to ChromaDB at {CHROMA_HOST}:{CHROMA_PORT}...")
    chroma_client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    
    db = Chroma(
        client=chroma_client,
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings
    )
    print("Initialization complete. All models loaded and connected.")

except Exception as e:
    print(f"FATAL ERROR during initialization: {e}")
    embeddings = None 
    model = None
    db = None

app = FastAPI()

@app.get("/query")
async def query_database(query_text: str = Query(..., min_length=1, description="The query text.")):

    if not db or not model:
        raise HTTPException(status_code=500, detail="Query service is not initialized correctly. Check server logs.")
        
    print(f"\nReceived query: {query_text}")

    print("Searching database for relevant documents...")

    results = db.similarity_search_with_relevance_scores(query_text, k=3)

    print(results)
    if len(results) == 0 or results[0][1] < 0.2:
        print(f"Unable to find matching results (score < 0.2).")
        return {"response": "I'm sorry, I couldn't find any relevant information to answer your question.", "sources": []}

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    print("Formatted context for LLM:")
    print(context_text)
    
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    
    print(f"--- CONTEXT SENT TO LLM --- \n{context_text}\n---------------------------")

    print("Sending prompt to Gemini...")
    
    response = model.invoke(prompt)
    response_text = response.content

    sources = [doc.metadata.get("source", "Unknown") for doc, _score in results]
    formatted_response = {"response": response_text, "sources": sources}
    print(f"Returning response: {formatted_response}")
    
    return formatted_response

if __name__ == "__main__":
    print("Starting Python Query Service on http://localhost:5002")
    uvicorn.run(app, host="localhost", port=5002)