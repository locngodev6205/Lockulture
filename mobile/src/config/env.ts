import { z } from 'zod';

const schema = z.object({
  dataSource: z.enum(['mock', 'api']).default('mock'),
  apiBaseUrl: z.string().url().default('http://localhost:8080/api/v1'),
});
// Expo replaces direct EXPO_PUBLIC references at bundle time. Never put API secrets here.
export const env = schema.parse({
  dataSource: process.env.EXPO_PUBLIC_DATA_SOURCE,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
});
