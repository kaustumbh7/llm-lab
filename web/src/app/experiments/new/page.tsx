'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createExperiment } from '@/lib/api';

const createExperimentSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters'),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
    prompt: z
      .string()
      .min(1, 'Prompt is required')
      .max(2000, 'Prompt must be less than 2000 characters'),
    temperatureMin: z
      .number()
      .min(0, 'Temperature must be at least 0')
      .max(2, 'Temperature must be at most 2'),
    temperatureMax: z
      .number()
      .min(0, 'Temperature must be at least 0')
      .max(2, 'Temperature must be at most 2'),
    topPMin: z
      .number()
      .min(0, 'Top-P must be at least 0')
      .max(1, 'Top-P must be at most 1'),
    topPMax: z
      .number()
      .min(0, 'Top-P must be at least 0')
      .max(1, 'Top-P must be at most 1'),
    topKMin: z
      .number()
      .min(1, 'Top-K must be at least 1')
      .max(100, 'Top-K must be at most 100'),
    topKMax: z
      .number()
      .min(1, 'Top-K must be at least 1')
      .max(100, 'Top-K must be at most 100'),
    maxTokensMin: z
      .number()
      .min(1, 'Max tokens must be at least 1')
      .max(1000, 'Max tokens must be at most 1000'),
    maxTokensMax: z
      .number()
      .min(1, 'Max tokens must be at least 1')
      .max(1000, 'Max tokens must be at most 1000'),
  })
  .refine((data) => data.temperatureMin <= data.temperatureMax, {
    message: 'Min temperature must be less than or equal to max temperature',
    path: ['temperatureMax'],
  })
  .refine((data) => data.topPMin <= data.topPMax, {
    message: 'Min top-P must be less than or equal to max top-P',
    path: ['topPMax'],
  })
  .refine((data) => data.topKMin <= data.topKMax, {
    message: 'Min top-K must be less than or equal to max top-K',
    path: ['topKMax'],
  })
  .refine((data) => data.maxTokensMin <= data.maxTokensMax, {
    message: 'Min max tokens must be less than or equal to max max tokens',
    path: ['maxTokensMax'],
  });

type CreateExperimentFormData = z.infer<typeof createExperimentSchema>;

export default function CreateExperimentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateExperimentFormData>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      name: '',
      description: '',
      prompt: '',
      temperatureMin: 0.1,
      temperatureMax: 0.9,
      topPMin: 0.1,
      topPMax: 0.9,
      topKMin: 10,
      topKMax: 50,
      maxTokensMin: 10,
      maxTokensMax: 50,
    },
  });

  const onSubmit = async (data: CreateExperimentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const experiment = await createExperiment(data);
      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create experiment',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiments
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create New Experiment</h1>
        <p className="text-muted-foreground">
          Configure your LLM experiment parameters and run it to generate
          responses with quality metrics.
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide a name, description, and prompt for your experiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiment Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My LLM Experiment" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your experiment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this experiment is testing..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description of your experiment goals
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt here..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The prompt that will be sent to the LLM
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Parameter Ranges */}
            <Card>
              <CardHeader>
                <CardTitle>Parameter Ranges</CardTitle>
                <CardDescription>
                  Set the ranges for each parameter. The system will generate
                  combinations within these ranges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temperature */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Temperature</h4>
                    <Badge variant="outline">Controls randomness</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="temperatureMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Temperature</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="2"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperatureMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Temperature</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="2"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Top-P */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Top-P</h4>
                    <Badge variant="outline">Controls diversity</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="topPMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Top-P</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topPMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Top-P</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Top-K */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Top-K</h4>
                    <Badge variant="outline">Controls vocabulary</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="topKMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Top-K</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topKMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Top-K</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Max Tokens */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Max Tokens</h4>
                    <Badge variant="outline">Controls length</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxTokensMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Max Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              max="1000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxTokensMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Max Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              max="1000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Experiment...
                  </>
                ) : (
                  'Create & Run Experiment'
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/15 rounded-md p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
