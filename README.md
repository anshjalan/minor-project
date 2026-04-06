# Civic Issue Reporting MVP

A practical student-level civic issue reporting platform built with the MERN stack and a lightweight AI service split into three independently deployable modules:

- `frontend` - React + Vite + TailwindCSS
- `backend` - Node.js + Express + MongoDB (MVC)
- `ml-models` - AI/ExAI helper APIs with optional OpenAI support and fallback heuristics

## Core Features

- JWT authentication with `user` and `admin` roles
- Issue reporting with image upload, location, description, and optional voice-assisted text input
- Admin dashboard for reviewing, filtering, and updating issue status
- Basic AI summary, categorization, explanation, and department routing
- Map view of submitted issues using Leaflet

## Project Structure

```text
frontend/
backend/
ml-models/
```

## Environment Setup

Copy each example env file to `.env` inside the same module before running.

## Run Locally

```bash
cd backend && npm install && npm run dev
cd ml-models && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Notes

- Voice-to-text uses the browser Web Speech API for the MVP because it is lightweight and student-friendly.
- The `ml-models` service still provides AI classification and explainability APIs, and can optionally use OpenAI when an API key is configured.
- If no OpenAI key is present, the AI service falls back to deterministic keyword-based categorization so the demo remains fully functional.
