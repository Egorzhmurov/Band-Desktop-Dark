'use client';

import { FormEvent, useState } from 'react';

type Step = {
  agent: string;
  output: string;
};

type OrchestrationResult = {
  finalOutput?: string;
  steps?: Step[];
  input?: string;
  note?: string;
};

export default function HomePage() {
  const [prompt, setPrompt] = useState('Create a dark desktop interface for a music dashboard with filters, queue, and a live waveform.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrchestrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/orchestrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = (await response.json()) as OrchestrationResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? `Request failed with status ${response.status}.`);
      }
      setResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <span className="badge">Band Desktop Dark</span>
        <h1>AI orchestration ready</h1>
        <p className="subtitle">
          Build, review, and shape dark-mode product ideas with a lightweight multi-agent workflow running locally in the browser.
        </p>
      </section>

      <section className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <label htmlFor="task">Task</label>
          <textarea
            id="task"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the feature or UI you want to generate"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Running orchestration...' : 'Run orchestration'}
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
      </section>

      {result && (
        <section className="panel results">
          <h2>Result</h2>
          <p>Input: {result.input}</p>

          <div className="step-list">
            {result.steps?.map((step, index) => (
              <div className="step" key={`${step.agent}-${index}`}>
                <div className="step-header">
                  <span className="dot" />
                  <span className="step-name">{step.agent}</span>
                </div>
                <p>{step.output}</p>
              </div>
            ))}
          </div>

          <div className="output-box">{result.finalOutput}</div>
          {result.note && <p className="subtitle">{result.note}</p>}
        </section>
      )}
    </main>
  );
}
