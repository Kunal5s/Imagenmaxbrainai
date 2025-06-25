import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
// The apiKey is read from an environment variable named GOOGLE_API_KEY.
// For the deployed app, this variable must be set in the Firebase App Hosting settings.
export const ai = genkit({
  plugins: [
    googleAI({apiKey: process.env.GOOGLE_API_KEY}),
  ],
});
