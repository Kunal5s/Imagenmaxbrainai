import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
//
// ======================================================================================
// !! IMPORTANT SECURITY WARNING !!
// ======================================================================================
// The API key is hardcoded below as a temporary workaround because you were unable
// to set it as an environment variable in your Firebase settings.
//
// THIS IS NOT SECURE. In a real application, you should NEVER expose your API key
// directly in the source code. Anyone who can see this code can steal your key.
//
// The correct way is to set this as a secret in your hosting provider's settings.
// For Firebase App Hosting, this is done in:
// Firebase Console -> App Hosting -> Your Backend -> Settings -> Environment variables
// ======================================================================================

// !! ACTION REQUIRED !!
// Replace the placeholder text below with your actual Google AI (Gemini) API key.
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY_HERE";


export const ai = genkit({
  plugins: [
    googleAI({apiKey: GOOGLE_API_KEY}),
  ],
});
