const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  model: string;
}

export interface ExperimentsResponse {
  experiments: Experiment[];
}

// Minimal API client - only what we need right now
export async function getExperiments(): Promise<Experiment[]> {
  const response = await fetch(`${API_BASE_URL}/experiments`);

  if (!response.ok) {
    throw new Error('Failed to fetch experiments');
  }

  const data = await response.json();
  // API returns array directly, not wrapped in { experiments: [...] }
  return Array.isArray(data) ? data : [];
}
