import type { CreateExperimentData, Experiment } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export async function getExperiment(id: string): Promise<Experiment> {
  const response = await fetch(`${API_BASE_URL}/experiments/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch experiment');
  }

  return response.json();
}

export async function createExperiment(
  data: CreateExperimentData,
): Promise<Experiment> {
  const response = await fetch(`${API_BASE_URL}/experiments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create experiment');
  }

  return response.json();
}

export async function exportExperiment(id: string): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/experiments/${id}/export`);

  if (!response.ok) {
    throw new Error('Failed to export experiment');
  }

  return response.json();
}
