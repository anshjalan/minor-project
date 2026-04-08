# Civic Issue Reporting MVP

A practical civic issue reporting platform built with the MERN stack and a lightweight AI service split into three independently deployable modules:

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