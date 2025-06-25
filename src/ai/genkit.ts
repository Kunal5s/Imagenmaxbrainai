import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
//
// ======================================================================================
// !! IMPORTANT SECURITY WARNING !!
// ======================================================================================
// The API key is hardcoded below. This is NOT SECURE for a production application.
// Anyone with access to your code can see and use your API key.
//
// For a real deployment on services like Netlify, Vercel, or Firebase App Hosting,
// you should set this as an environment variable in your hosting provider's settings.
// Name the variable: GOOGLE_API_KEY
// ======================================================================================

// The user's Google AI (Gemini) API key.
const GOOGLE_API_KEY = "AIzaSyAqzB8Iy4YSdURqL3Sq7osoRq4wv-m_kus";


export const ai = genkit({
  plugins: [
    googleAI({apiKey: GOOGLE_API_KEY}),
  ],
});
