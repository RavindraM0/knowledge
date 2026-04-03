# AI RAG Knowledge Chatbot

A production-grade, AI-powered Retrieval-Augmented Generation (RAG) chatbot application. This project allows users to upload PDF documents, processes them using vector embeddings, and enables a conversational interface to query the knowledge base intelligently using Large Language Models.

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Language:** TypeScript/React

### Backend
- **Server:** Node.js with [Express](https://expressjs.com/)
- **Database / Vector Search:** [MongoDB Atlas Vector Search](https://www.mongodb.com/products/platform/atlas-vector-search)
- **Embeddings:** HuggingFace Embeddings
- **LLM API:** Google Gemini 1.5 Flash API for fast, reliable generation

## Project Structure

This repository is split into two main sections:

- `/frontend`: The interactive user interface built with Next.js.
- `/backend`: The robust Node/Express server that handles PDF ingestion, chunking, embeddings, and interacting with the LLM and MongoDB.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster with Vector Search configured
- API keys from Groq and HuggingFace

### Setup Instructions

1. **Clone the repository and install dependencies:**
   Navigate into the respective directories to install:
   ```bash
   cd rag-chatbot/backend
   npm install

   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables:**
   - In the `backend` directory, create a `.env` file based on the required keys for your RAG stack:
     - `PORT` (e.g., 5000)
     - `MONGODB_URI`
     - `GEMINI_API_KEY`
     - `HUGGINGFACE_API_KEY`

3. **Start the applications:**
   - To start the Express API backend:
     ```bash
     cd backend
     npm run dev
     ```
   - To start the Next.js frontend:
     ```bash
     cd frontend
     npm run dev
     ```

4. **View the Application:**
   Open your browser and navigate to `http://localhost:3000`.

## Architecture Overview

1. **Document Ingestion:** Users upload PDFs via the frontend. The backend extracts the text using a PDF parser and chunks it using our custom text chunking utilities.
2. **Vectorization:** The text chunks are sent to HuggingFace to generate high-quality vector embeddings.
3. **Storage:** The embeddings and original text are securely stored in MongoDB Atlas, leveraging its Vector Search capabilities.
4. **Retrieval & Chat:** User queries are sent from the frontend, vectorized in the backend, and used to perform a similarity search in MongoDB. The most relevant chunks, along with the user's prompt, are fed to the Gemini 1.5 Flash API to generate a precise, context-aware response seamlessly streamed to the UI.

## License

MIT
