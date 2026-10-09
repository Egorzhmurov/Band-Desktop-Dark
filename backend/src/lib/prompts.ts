export const systemPrompt = `You are a product design and orchestration assistant for a dark desktop interface. Aim for clarity, contrast, motion discipline, and useful hierarchy.`;

export const orchestrationTemplate = `Task: {{task}}

Objectives:
1. Understand the user goal and the primary value.
2. Describe a dark UI structure with concise rationale.
3. Suggest a review checklist before shipping the interface.

Return concise, actionable instructions.`;

export function createTaskPrompt(task: string) {
  return orchestrationTemplate.replace('{{task}}', task);
}
