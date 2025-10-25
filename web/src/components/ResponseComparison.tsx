'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ExperimentResponse } from '@/lib/types';

interface ResponseComparisonProps {
  responses: ExperimentResponse[];
}

export function ResponseComparison({ responses }: ResponseComparisonProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1]);

  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response Comparison</CardTitle>
          <CardDescription>No data available for comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No responses available to compare.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedResponses = selectedIndices.map((index) => responses[index]);

  const handlePrevious = () => {
    setSelectedIndices((prev) =>
      prev.map((index) => (index > 0 ? index - 1 : responses.length - 1)),
    );
  };

  const handleNext = () => {
    setSelectedIndices((prev) =>
      prev.map((index) => (index < responses.length - 1 ? index + 1 : 0)),
    );
  };

  const handleSelectResponse = (
    responseIndex: number,
    comparisonIndex: number,
  ) => {
    setSelectedIndices((prev) => {
      const newIndices = [...prev];
      newIndices[comparisonIndex] = responseIndex;
      return newIndices;
    });
  };

  return (
    <div className="space-y-6">
      {/* Response Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Response Comparison</CardTitle>
          <CardDescription>
            Compare different responses side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-muted-foreground text-sm">
              {selectedIndices[0] + 1} vs {selectedIndices[1] + 1} of{' '}
              {responses.length}
            </div>
          </div>

          {/* Response Selection Dropdowns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Response A
              </label>
              <select
                value={selectedIndices[0]}
                onChange={(e) =>
                  handleSelectResponse(parseInt(e.target.value), 0)
                }
                className="w-full rounded-md border p-2"
              >
                {responses.map((_, index) => (
                  <option key={index} value={index}>
                    Response {index + 1} - Score:{' '}
                    {responses[index].metrics?.overallScore?.toFixed(2) ||
                      'N/A'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Response B
              </label>
              <select
                value={selectedIndices[1]}
                onChange={(e) =>
                  handleSelectResponse(parseInt(e.target.value), 1)
                }
                className="w-full rounded-md border p-2"
              >
                {responses.map((_, index) => (
                  <option key={index} value={index}>
                    Response {index + 1} - Score:{' '}
                    {responses[index].metrics?.overallScore?.toFixed(2) ||
                      'N/A'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {selectedResponses.map((response, comparisonIndex) => (
          <Card key={`${selectedIndices[comparisonIndex]}-${comparisonIndex}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Response {selectedIndices[comparisonIndex] + 1}
                {response.metrics && (
                  <Badge variant="secondary">
                    Score: {response.metrics.overallScore?.toFixed(2)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Parameters: T={response.temperature}, P={response.topP}, K=
                {response.topK}, Tokens={response.maxTokens}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Response Content */}
                <div>
                  <h4 className="mb-2 font-semibold">Content</h4>
                  <div className="bg-muted max-h-64 overflow-y-auto rounded-lg p-4 text-sm">
                    {response.content}
                  </div>
                </div>

                {/* Metrics */}
                {response.metrics && (
                  <div>
                    <h4 className="mb-2 font-semibold">Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Coherence:</span>
                        <span className="font-medium">
                          {response.metrics.coherenceScore?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completeness:</span>
                        <span className="font-medium">
                          {response.metrics.completenessScore?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="font-medium">
                          {response.metrics.lengthScore?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Structure:</span>
                        <span className="font-medium">
                          {response.metrics.structureScore?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vocabulary:</span>
                        <span className="font-medium">
                          {response.metrics.vocabularyScore?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metrics Comparison Chart */}
      {selectedResponses[0].metrics && selectedResponses[1].metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics Comparison</CardTitle>
            <CardDescription>
              Side-by-side comparison of metric scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  key: 'overallScore',
                  label: 'Overall Score',
                  color: 'text-blue-600',
                },
                {
                  key: 'coherenceScore',
                  label: 'Coherence',
                  color: 'text-green-600',
                },
                {
                  key: 'completenessScore',
                  label: 'Completeness',
                  color: 'text-purple-600',
                },
                {
                  key: 'lengthScore',
                  label: 'Length',
                  color: 'text-orange-600',
                },
                {
                  key: 'structureScore',
                  label: 'Structure',
                  color: 'text-red-600',
                },
                {
                  key: 'vocabularyScore',
                  label: 'Vocabulary',
                  color: 'text-indigo-600',
                },
              ].map(({ key, label, color }) => {
                const scoreA =
                  (selectedResponses[0].metrics as Record<string, number>)?.[
                    key
                  ] || 0;
                const scoreB =
                  (selectedResponses[1].metrics as Record<string, number>)?.[
                    key
                  ] || 0;
                const difference = scoreA - scoreB;
                const isBetter = difference > 0;

                return (
                  <div
                    key={key}
                    className="bg-muted flex items-center justify-between rounded-lg p-3"
                  >
                    <span className="font-medium">{label}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${color}`}>
                          {scoreA.toFixed(2)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Response A
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${color}`}>
                          {scoreB.toFixed(2)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Response B
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-sm font-medium ${isBetter ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {isBetter ? '+' : ''}
                          {difference.toFixed(2)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Difference
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
