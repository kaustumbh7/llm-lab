import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getExperiments } from '@/lib/api';
import type { Experiment } from '@/lib/types';

export default async function HomePage() {
  let experiments: Experiment[] = [];
  let error: string | null = null;

  try {
    experiments = await getExperiments();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load experiments';
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">LLM Lab</h1>
          <p className="text-muted-foreground">
            Manage and analyze your LLM experiments
          </p>
        </div>
        <Button>Create Experiment</Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No experiments yet. Create your first experiment!
                </p>
              </CardContent>
            </Card>
          ) : (
            experiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <CardTitle>{experiment.name}</CardTitle>
                  <CardDescription>
                    {experiment.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    <p>Model: {experiment.model}</p>
                    <p>
                      Created:{' '}
                      {new Date(experiment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href={`/experiments/${experiment.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
