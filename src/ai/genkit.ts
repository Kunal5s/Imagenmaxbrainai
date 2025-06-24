import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const googleVertex = googleAI({
  apiProvider: 'vertex',
  location: 'us-central1',
});

export const ai = genkit({
  plugins: [googleVertex],
});
