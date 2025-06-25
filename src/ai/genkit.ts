import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
//
// ======================================================================================
// !! IMPORTANT !!
// ======================================================================================
// Your Google AI API key is now read from an environment variable.
// For local development, set GOOGLE_API_KEY in the .env file.
//
// For production deployment on services like Firebase App Hosting,
// you MUST set GOOGLE_API_KEY as a secret or environment variable in your
// hosting provider's settings.
// ======================================================================================

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  // This error will be thrown during the build process if the key is not set,
  // preventing a broken deployment.
  throw new Error(
    'GOOGLE_API_KEY is not set in your environment variables. Please set it in your .env file for local development or in your hosting provider for production.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: GOOGLE_API_KEY})],
});
