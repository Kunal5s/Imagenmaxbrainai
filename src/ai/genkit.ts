import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
//
// FOR THE LIVE DEPLOYED APP:
// This code reads the API key from a secret environment variable named GOOGLE_API_KEY.
// You MUST set this variable in your Firebase App Hosting backend settings.
// 1. Go to Firebase Console -> App Hosting -> Your Backend -> Settings
// 2. Scroll down to "Environment variables"
// 3. Add a variable with the Name "GOOGLE_API_KEY" and your key as the Value.
// 4. Republish your app.
//
// FOR LOCAL DEVELOPMENT:
// This code will also read the key from a local .env file.
export const ai = genkit({
  plugins: [
    googleAI({apiKey: process.env.GOOGLE_API_KEY}),
  ],
});
