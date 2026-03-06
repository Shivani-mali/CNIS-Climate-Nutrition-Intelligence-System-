# CNIS - Climate-Nutrition Intelligence System

*AI-Powered Nutrition Intelligence for Every Child*

A full-stack React web application for ASHA workers, parents, and healthcare professionals to screen, monitor, and manage child malnutrition with voice-enabled, multilingual, and AI-powered features.

## Features

### 1. Professional UI/UX
- Clinical Blue/White theme matching cnis.netlify.app
- Animated splash screen, Google Auth, Role selection flow
- Responsive mobile-first design with bottom navigation
- Glassmorphism cards and smooth animations

### 2. Voice-Enabled (Hands-Free)
- Voice Commands in English, Hindi, and Marathi
- Voice Data Entry - Click mic on any input field
- Audio Feedback - Results read aloud via Text-to-Speech

### 3. WHO-Based Screening
- MUAC Classification (primary trigger)
- Weight-for-Height Z-score approximation
- Medical History flags with danger sign detection

### 4. Image Guardrail (TensorFlow.js)
- MobileNet model validates uploaded photos
- Rejects animal/object photos with clear error

### 5. Location and Climate-Based Diet
- Auto-detects state and season
- Region-specific food recommendations
- Severity-specific dietary guidance

### 6. Integrated Medibot
- Full chatbot UI with offline knowledge base
- Gemini AI API integration
- Voice input/output support

### 7. Multilingual (i18next)
- English, Hindi, Marathi

### 8. Offline First (PWA)
- Full Progressive Web App (PWA) allowing zero-network installation
- Service Worker caches CSS, JS, HTML, fonts, and assets
- Offline Firestore persistence (IndexedDB)
- Background syncing when internet connection returns

### 9. Vaccination & Health Tracking
- Dedicated "Doses" page tracking National Immunization Schedule
- Data Export feature allows downloading complete screening records as Excel-friendly CSVs

### 10. Firebase Integration
- Google Authentication with Offline Demo fallback
- Firestore for remote and local screening records
- Security rules for data privacy

## Setup

1. npm install
2. Copy .env.example to .env and add Firebase credentials
3. npm run dev
