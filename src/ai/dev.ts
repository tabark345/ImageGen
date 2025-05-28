import { config } from 'dotenv';
config();

import '@/ai/flows/refine-image-prompt.ts';
import '@/ai/flows/generate-image-from-prompt.ts';
import '@/ai/flows/propose-image-variations.ts';