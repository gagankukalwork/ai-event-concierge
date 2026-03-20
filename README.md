# AI Event Concierge

An AI-powered event planning assistant that suggests venues for event ideas and stores them in a database for future reference.  
Built with React (frontend), Express (backend), Supabase (database), and deployed on Vercel and Railway.

## Live Demo
- Frontend (Vercel): https://ai-event-concierge-git-main-gagankukalworks-projects.vercel.app/
- Backend (Railway): https://ai-event-concierge-production.up.railway.app/

## Tech Stack
- Frontend: React, CSS  
- Backend: Node.js, Express, Axios  
- Database: Supabase (Postgres)  
- AI Integration: OpenRouter API  
- Deployment: Vercel (frontend), Railway (backend)

## Features
- Input an event idea and receive 3–5 AI-generated venue suggestions.  
- Venue suggestions include:
  - venueName
  - location
  - estimatedCost
  - whyItFits
- Results are stored in a Postgres database.  
- Past event ideas can be viewed via the /history endpoint.  
- Environment variables are used securely (DATABASE_URL, OPENROUTER_API_KEY, REACT_APP_API_URL).



### Clone the Repo
```
bash
git clone https://github.com/gagankukalwork/ai-event-concierge.git
cd ai-event-concierge
cd backend
npm install
npm start
cd frontend
npm start
```


