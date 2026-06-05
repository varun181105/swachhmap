# 🗺️ SwachhMap — AI-Powered Waste Reporting for India

> Make Your City Clean & Beautiful

**Live Demo:** https://swachhmap-tof7.vercel.app

---

## What is SwachhMap?

SwachhMap is a full-stack civic tech platform that connects 
citizens, AI, and municipal authorities to solve waste management 
challenges across India.

Citizens report garbage by uploading a photo and sharing their 
GPS location. AI analyzes the image, classifies waste type and 
severity, and plots it on a live map. Municipality officers can 
log into the admin dashboard to track hotspots and mark issues 
as resolved.

---

## Features

- 📸 **Citizen Reporting** — Upload photo + auto-detect GPS location
- 🤖 **AI Analysis** — Gemini Vision API classifies waste type and severity
- 🗺️ **Live Map** — Real-time hotspot map with color-coded markers
- 📊 **Admin Dashboard** — Municipality login, filter reports, mark resolved
- 📱 **Mobile Friendly** — Works on any phone browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| AI | Google Gemini Vision API |
| Maps | Leaflet.js + React Leaflet |
| Deployment | Vercel |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/report` | Citizen waste report form |
| `/map` | Live interactive map |
| `/admin` | Municipality dashboard (password protected) |

---

## Getting Started

1. Clone the repo
```bash
git clone https://github.com/varun181105/swachhmap.git
cd swachhmap
npm install
```

2. Create `.env.local` file
