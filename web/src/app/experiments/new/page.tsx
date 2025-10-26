'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [showRateLimitMessage, setShowRateLimitMessage] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (data: CreateExperimentFormData) => {
    setIsSubmitting(true);
    setError(null);
    setShowRateLimitMessage(false);

    // Set a timeout to show rate limit message after 2 seconds
    timeoutRef.current = setTimeout(() => {
      console.log('Timeout reached - showing rate limit message');
      setShowRateLimitMessage(true);
    }, 10000);

    try {
      const experiment = await createExperiment(data);
      if (timeoutRef.current) {
        console.log('Clearing timeout - experiment completed successfully');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      if (timeoutRef.current) {
        console.log('Clearing timeout - experiment failed');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setError(
        err instanceof Error ? err.message : 'Failed to create experiment',
      );
    } finally {
      setIsSubmitting(false);
      setShowRateLimitMessage(false);
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
                <CardTitle>Experiment Details</CardTitle>
                <CardDescription>
                  Provide the basic information and prompt for your LLM
                  experiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  Configure the parameter ranges for your experiment. The system
                  will automatically generate combinations within these ranges
                  and test each one to find the optimal settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Temperature */}
                  <div className="rounded-lg border bg-blue-50/50 p-4">
                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-blue-900">
                          Temperature
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          Controls randomness
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">
                        Controls the randomness of the output. Lower values
                        (0.1-0.3) produce more focused, deterministic responses.
                        Higher values (0.7-1.0) produce more creative, diverse
                        responses.
                      </p>
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Top-P */}
                  <div className="rounded-lg border bg-green-50/50 p-4">
                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-green-900">
                          Top-P (Nucleus Sampling)
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Controls diversity
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        Controls the diversity of token selection. Lower values
                        (0.1-0.3) focus on high-probability tokens, while higher
                        values (0.7-0.9) allow more diverse token selection.
                      </p>
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Top-K */}
                  <div className="rounded-lg border bg-purple-50/50 p-4">
                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-purple-900">
                          Top-K
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          Controls vocabulary
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700">
                        Limits the number of highest-probability tokens to
                        consider. Lower values (10-20) focus on the most likely
                        tokens, while higher values (40-50) allow more
                        vocabulary diversity.
                      </p>
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
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
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
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div className="rounded-lg border bg-orange-50/50 p-4">
                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-orange-900">
                          Max Tokens
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          Controls length
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-700">
                        Sets the maximum length of the generated response. Lower
                        values (10-50) produce concise answers, while higher
                        values (100-500) allow for more detailed, comprehensive
                        responses.
                      </p>
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
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
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
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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

            {/* Rate Limit Message */}
            {showRateLimitMessage && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Google Gemini API Rate Limit Reached
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        The experiment is taking longer than expected due to API
                        rate limits. Please be patient while the responses are
                        being computed. This may take a few more seconds
                        depending on the number of parameter combinations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
