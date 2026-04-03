# 🧠 AI-Powered Knowledge Base Chatbot (RAG App)

A production-ready **Retrieval-Augmented Generation (RAG)** application that allows users to upload PDF documents and hold context-aware conversations powered by AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini_Flash-orange.svg)

---

## 🚀 Key Features

-   **📄 Smart PDF Ingestion**: Upload documents that are automatically parsed, chunked, and embedded.
-   **🔍 Vector Search**: Uses **MongoDB Atlas Vector Search** to find the most relevant document context for every question.
-   **🤖 Context-Aware AI**: Powered by **Google Gemini Flash** for high-speed, accurate responses.
-   **💬 Real-time Chat**: Modern, responsive UI with chat history persistence.
-   **☁️ Cloud Native**: Fully integrated with MongoDB Atlas and serverless-ready.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, TypeScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Vector Search M0 Tier) |
| **Embedding Model** | HuggingFace `all-MiniLM-L6-v2` |
| **LLM Inference** | Google Gemini Generative AI |

---

## 📦 Project Structure

```text
rag-chatbot/
├── frontend/                 # Next.js 14 App
│   ├── src/app/              # Pages & Layouts
│   ├── src/components/       # UI Components (Sidebar, Chat)
│   └── .env.local            # Frontend Keys
└── backend/                  # Node.js + Express API
    ├── src/controllers/      # Business Logic
    ├── src/models/           # Mongoose Schemas (Chunks, Chats)
    ├── src/routes/           # API Endpoints
    ├── src/utils/            # PDF Parsing & Vector Helpers
    └── .env                  # Backend Secrets
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
-   Node.js (v18 or higher)
-   MongoDB Atlas account
-   API keys for **Gemini** and **HuggingFace**

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   GEMINI_API_KEY=your_gemini_key
   HF_ACCESS_TOKEN=your_huggingface_token
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the development server: `npm run dev`

---

## 💡 How it Works (RAG Pipeline)

1.  **Ingestion**: PDFs are uploaded and text is extracted using `pdf-parse`.
2.  **Chunking**: Raw text is split into smaller, overlapping chunks (approx. 1000 chars) for precise retrieval.
3.  **Embedding**: Each chunk is converted into a 384-dimensional vector using HuggingFace.
4.  **Storage**: Vectors are stored in **MongoDB Atlas** with a defined `Vector Search Index`.
5.  **Retrieval**: When you ask a question, the question is also vectorized. MongoDB finds the most similar chunks.
6.  **Generation**: The original question + retrieved context is sent to **Gemini**, which generates the final answer.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ravindra**
*   [GitHub](https://github.com/RavindraM0)
*   Final Year B.Tech CSE Student

Designed with ❤️ as part of the Advanced Agentic Coding project.
