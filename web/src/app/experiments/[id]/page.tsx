import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ExportButton } from '@/components/ExportButton';
import { MetricsVisualization } from '@/components/MetricsVisualization';
import { ParameterAnalysis } from '@/components/ParameterAnalysis';
import { ResponseComparison } from '@/components/ResponseComparison';
import { ResponsePagination } from '@/components/ResponsePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getExperiment } from '@/lib/api';
import type { ExperimentWithResponses } from '@/lib/types';

interface ExperimentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExperimentDetailPage({
  params,
}: ExperimentDetailPageProps) {
  let experiment: ExperimentWithResponses | null = null;
  let error: string | null = null;

  try {
    const { id } = await params;
    experiment = await getExperiment(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load experiment';
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experiments
            </Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Experiment Not Found</h1>
          <p className="text-gray-600">
            The experiment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Experiments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiments
          </Link>
        </Button>
        <ExportButton experimentId={experiment.id} />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{experiment.name}</h1>
        <p className="text-muted-foreground mb-4">
          {experiment.description || 'No description provided'}
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">{experiment.model}</Badge>
          <Badge variant="outline">
            Created {new Date(experiment.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Experiment Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Experiment Parameters</CardTitle>
            <CardDescription>
              Parameter ranges and steps used for this experiment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="mb-2 font-semibold">Temperature</h4>
                <p className="text-muted-foreground text-sm">
                  {experiment.temperatureMin} - {experiment.temperatureMax}
                </p>
                <p className="text-muted-foreground text-xs">
                  Step: {experiment.temperatureStep}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Top-P</h4>
                <p className="text-muted-foreground text-sm">
                  {experiment.topPMin} - {experiment.topPMax}
                </p>
                <p className="text-muted-foreground text-xs">
                  Step: {experiment.topPStep}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Top-K</h4>
                <p className="text-muted-foreground text-sm">
                  {experiment.topKMin} - {experiment.topKMax}
                </p>
                <p className="text-muted-foreground text-xs">
                  Step: {experiment.topKStep}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Max Tokens</h4>
                <p className="text-muted-foreground text-sm">
                  {experiment.maxTokensMin} - {experiment.maxTokensMax}
                </p>
                <p className="text-muted-foreground text-xs">
                  Step: {experiment.maxTokensStep}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <p className="whitespace-pre-wrap">{experiment.prompt}</p>
            </div>
          </CardContent>
        </Card>

        {/* Separator */}
        <div className="border-border my-8 border-t"></div>

        {/* Tabs Section */}
        {experiment.responses && experiment.responses.length > 0 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Experiment Results</h2>
              <p className="text-muted-foreground">
                Analyze your experiment results with interactive visualizations
                and comparisons.
              </p>
            </div>

            <Tabs defaultValue="responses" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="responses">Responses</TabsTrigger>
                <TabsTrigger value="metrics">Performance</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="responses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Responses</CardTitle>
                    <CardDescription>
                      All generated responses with their parameters and quality
                      metrics. Use the pagination below to navigate through all
                      responses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsePagination responses={experiment.responses} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <MetricsVisualization responses={experiment.responses} />
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <ParameterAnalysis responses={experiment.responses} />
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                {experiment.responses.length > 1 ? (
                  <ResponseComparison responses={experiment.responses} />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center">
                        Comparison requires at least 2 responses. This
                        experiment has only {experiment.responses.length}{' '}
                        response.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Experiment Results</h2>
              <p className="text-muted-foreground">
                No responses found for this experiment.
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  This experiment has not been run yet or no responses were
                  generated.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
