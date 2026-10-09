import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';

import { agents, orchestratePrompt } from './lib/agents';
import { createTaskPrompt, systemPrompt } from './lib/prompts';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
const defaultPrompt = 'Create a polished dark-mode interface for a desktop music experience.';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/orchestrate', (_request, response) => {
  response.json({
    ok: true,
    message: 'Orchestration API is running.',
    agents,
  });
});

app.post('/api/orchestrate', (request, response) => {
  const body: unknown = request.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    response.status(400).json({ ok: false, error: 'Request body must be a JSON object.' });
    return;
  }

  const requestedPrompt = (body as { prompt?: unknown }).prompt;
  if (requestedPrompt !== undefined && typeof requestedPrompt !== 'string') {
    response.status(400).json({ ok: false, error: 'The prompt field must be a string.' });
    return;
  }

  const prompt = requestedPrompt?.trim() || defaultPrompt;
  const steps = orchestratePrompt(prompt);
  const finalTaskPrompt = createTaskPrompt(prompt);
  const finalOutput = `System: ${systemPrompt}\n\n${finalTaskPrompt}\n\nSuggested stream:\n${steps
    .map((step) => `- ${step.agent}: ${step.output}`)
    .join('\n')}`;

  response.json({
    ok: true,
    input: prompt,
    agents,
    steps,
    finalOutput,
    note: 'Local orchestration fallback is active because no external provider key is configured yet.',
  });
});

const handleErrors: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    response.status(400).json({ ok: false, error: 'Request body contains invalid JSON.' });
    return;
  }

  console.error('Unhandled API error:', error);
  response.status(500).json({ ok: false, error: 'An unexpected API error occurred.' });
};

app.use(handleErrors);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
