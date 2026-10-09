export type Agent = {
  name: string;
  specialty: string;
  role: string;
};

export const agents: Agent[] = [
  {
    name: 'planner',
    specialty: 'product strategy',
    role: 'Break the task into a clear execution plan and identify user value.',
  },
  {
    name: 'builder',
    specialty: 'interface implementation',
    role: 'Translate the plan into a concrete dark-mode layout and feature structure.',
  },
  {
    name: 'reviewer',
    specialty: 'quality and consistency',
    role: 'Check the output for UX quality, clarity, and implementation readiness.',
  },
];

export function orchestratePrompt(input: string) {
  const normalized = input.trim() || 'Create a polished dark mode experience with strong hierarchy and useful actions.';

  return [
    {
      agent: 'planner',
      output: `Plan: outline the problem, flag core user needs, and define a clear sequence for ${normalized.toLowerCase()}.`,
    },
    {
      agent: 'builder',
      output: `Build: shape the concept into a dark interface with visual hierarchy, control grouping, and a clean workflow for ${normalized.toLowerCase()}.`,
    },
    {
      agent: 'reviewer',
      output: `Review: confirm the solution is understandable, accessible, and consistent before finalizing ${normalized.toLowerCase()}.`,
    },
  ];
}
