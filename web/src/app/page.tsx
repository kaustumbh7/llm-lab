import { Plus } from 'lucide-react';
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

// Disable caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let experiments: Experiment[] = [];
  let error: string | null = null;

  try {
    console.log('Fetching experiments from:', process.env.NEXT_PUBLIC_API_URL);
    experiments = await getExperiments();
    console.log('Fetched experiments:', experiments.length);
  } catch (err) {
    console.error('Error fetching experiments:', err);
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
        <Button asChild>
          <Link href="/experiments/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Experiment
          </Link>
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {experiments.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No experiments yet. Create your first experiment!
                </p>
              </CardContent>
            </Card>
          ) : (
            experiments.map((experiment) => (
              <Card
                key={experiment.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-lg">
                    {experiment.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {experiment.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-muted-foreground space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Model:</span>
                      <span className="font-medium">{experiment.model}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {new Date(experiment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    asChild
                  >
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
