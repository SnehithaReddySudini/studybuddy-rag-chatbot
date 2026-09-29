# 📚 StudyBuddy — Multimodal RAG Chatbot for Students

An Ed-Tech chatbot that answers questions from a study-notes knowledge base (RAG), understands uploaded images (e.g. a photo of a problem or diagram), and generates interactive quizzes (tool calling + generative UI).

**Live demo:** https://studybuddy-rag-chatbot.vercel.app

## Features
- **Text + image queries:** ask a question or upload an image and ask about it
- **RAG:** notes in `data/docs` are chunked and embedded with Gemini embeddings; the top matching chunks are retrieved by cosine similarity and injected into the prompt
- **Tool calling:** the model calls a `createQuiz` tool to generate multiple-choice quizzes
- **Generative UI:** quiz results render as an interactive card (click an option to see correct/incorrect)

## Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS, Vercel AI SDK, Groq (`qwen/qwen3.8-27b`, multimodal), Google Gemini embeddings (`gemini-embedding-001`), deployed on Vercel.

## Architecture
1. `scripts/ingest.ts` reads `data/docs/*.md`, chunks the text, embeds it, and writes `data/embeddings.json`
2. `lib/rag.ts` embeds the user query and returns the top-k most similar chunks
3. `app/api/chat/route.ts` adds the retrieved context to the system prompt and streams the response from Groq; it also exposes the `createQuiz` tool
4. `app/page.tsx` is the chat UI (text, image upload, quiz card)

## Setup
```bash
git clone https://github.com/SnehithaReddySudini/studybuddy-rag-chatbot.git
cd studybuddy-rag-chatbot
npm install
```
Create `.env.local`:
```
GROQ_API_KEY=your_groq_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```
Build the index (only needed after changing notes in `data/docs`), then run:
```bash
node --env-file=.env.local --import tsx scripts/ingest.ts
npm run dev
```
Open http://localhost:3000

## Demo Guide
1. **RAG:** `What is the quadratic formula?` → answers from the algebra notes
2. **Multimodal:** upload a photo of a math problem or a diagram and ask `Explain this step by step`
3. **Tool + generative UI:** `Quiz me on photosynthesis` → interactive quiz card

## Adding your own notes
Add `.md` files to `data/docs/` and re-run the ingest script.