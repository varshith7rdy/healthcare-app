import os
from fastapi import FastAPI, HTTPException
import uvicorn # type: ignore
from dotenv import load_dotenv # type: ignore
from langchain_community.document_loaders import DirectoryLoader # type: ignore
from langchain_community.document_loaders.unstructured import UnstructuredFileLoader # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from langchain_core.documents import Document # type: ignore
from langchain_huggingface import HuggingFaceEmbeddings # type: ignore
import chromadb # type: ignore
from chromadb.utils import embedding_functions # type: ignore


load_dotenv()


DATA_PATH = "data/books" 
CHROMA_URL = "http://localhost:8000"
COLLECTION_NAME = "my-rag-collection"


app = FastAPI()

@app.post("/ingest")
async def ingest_data():

    try:
        print("Starting data ingestion...")
        documents = load_documents()
        if not documents:
            print("No new documents found to ingest.")
            return {"message": "No new documents found."}
        
        chunks = split_text(documents)
        save_to_chroma(chunks)
        return {"message": f"Successfully ingested {len(chunks)} chunks into {COLLECTION_NAME}"}
    
    except Exception as e:
        print(f"Error during ingestion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def load_documents():

    loader = DirectoryLoader(
        DATA_PATH,
        glob="**/*",
        loader_cls=UnstructuredFileLoader,
        show_progress=True,
        use_multithreading=True,
        recursive=True
    )
    
    print(f"Loading documents from {DATA_PATH} using UnstructuredFileLoader...")
    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
    return documents

def split_text(documents: list[Document]):
    """
    Splits documents into smaller chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    print("Splitting documents...")
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")
    return chunks

def save_to_chroma(chunks: list[Document]):

    print(f"Connecting to Chroma server at {CHROMA_URL}...")
    chroma_client = chromadb.HttpClient(host='localhost', port=8000)

    
    print("Initializing local embedding model (all-MiniLM-L6-v2)...")
    
    embeddings_model = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )

    print(f"Getting or creating collection: {COLLECTION_NAME}")
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )

    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        
        ids = [f"chunk_{i+j}_{chunk.metadata.get('source', 'unknown')}_{chunk.metadata.get('start_index', 'none')}" for j, chunk in enumerate(batch)]
        documents_list = [chunk.page_content for chunk in batch]
        metadata_list = [chunk.metadata for chunk in batch]

        print(f"Generating {len(documents_list)} embeddings for batch {i//batch_size + 1}...")
        embeddings_list = embeddings_model.embed_documents(documents_list)
        print("Embeddings generated.")

        collection.add(
            ids=ids,
            embeddings=embeddings_list,
            documents=documents_list,
            metadatas=metadata_list,
        )
    
    print(f"Saved {len(chunks)} chunks to Chroma server.")


if __name__ == "__main__":
    print("Starting Python Ingestion Service on http://localhost:5001")
    uvicorn.run(app, host="localhost", port=5001)