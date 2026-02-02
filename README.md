# Card-Us App Shell

## Introduction

Hi! I'm Carmen Witsman, a Data Science undergraduate at UNIR (Spain) with dual Spanish-American citizenship.

## The Problem

Gen Z is suffering from "social media fatigue." We are tired of doomscrolling, empty likes, and fake validation. We don't just want to share our lives; we want to play them.

## The Solution

CardUS is a web app that turns reality into a Trading Card Game. Instead of posting a photo for likes, users upload their moments to generate unique, playable assets.

## How it works

Powered by Google Gemini 1.5 Flash, the system analyzes the visual context of an image (e.g., a gym selfie or a messy room) and instantly generates a "Trading Card" with:

- Stats: Logic-based attributes like "Ego," "Aura," or "Cringe."
- The Roast: A humorous, AI-generated critique of the photo.
- Battle Mechanics: Users can use these cards to battle friends, where the AI acts as a referee to decide the winner based on the cards' context.

## Tech Stack

Built with Next.js, Vercel, and the Gemini API (Multimodal capabilities).

A Next.js 16 + React 19 app using the App Router, Tailwind CSS, and Radix UI components.

## Getting Started

Install dependencies:

- pnpm: `pnpm install`
- npm: `npm install`

Run the dev server:

- pnpm: `pnpm dev`
- npm: `npm run dev`

Then open http://localhost:3000.

## Scripts

- `dev` — start the development server
- `build` — create a production build
- `start` — run the production server
- `lint` — run ESLint

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `components/` — reusable UI and feature components
- `context/` — React context providers
- `hooks/` — custom hooks
- `lib/` — helpers and app utilities
- `public/` — static assets
- `styles/` — global styles

## Environment Variables

If you add environment variables, place them in `.env.local` (not committed).

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
