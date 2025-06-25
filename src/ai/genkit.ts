import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration tells Genkit to use the Google AI provider.
//
// ======================================================================================
// !! IMPORTANT !!
// ======================================================================================
// Your Google AI API key is hardcoded below to ensure successful deployment
// with Firebase Hosting. For enhanced security in the future, you might consider
// moving this to a more secure environment variable management system.
// ======================================================================================

const GOOGLE_API_KEY = "AIzaSyC0GmkWhdhTe6nW1QMNOcdnixmJSUJNiYs";

if (!GOOGLE_API_KEY) {
  // This error will be thrown during the build process if the key is not set,
  // preventing a broken deployment.
  throw new Error(
    'GOOGLE_API_KEY is not set. Please add it to src/ai/genkit.ts to continue.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: GOOGLE_API_KEY})],
});
