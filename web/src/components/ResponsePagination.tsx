'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { ExperimentResponse } from '@/lib/types';

interface ResponsePaginationProps {
  responses: ExperimentResponse[];
  itemsPerPage?: number;
}

export function ResponsePagination({
  responses,
  itemsPerPage = 5,
}: ResponsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(responses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResponses = responses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (responses.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No responses found for this experiment.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Responses */}
      <div className="space-y-4">
        {currentResponses.map((response) => (
          <div key={response.id} className="rounded-lg border p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                  T: {response.temperature}
                </span>
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700/10 ring-inset">
                  P: {response.topP}
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
                  K: {response.topK}
                </span>
                <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-700/10 ring-inset">
                  Tokens: {response.maxTokens}
                </span>
              </div>
              {response.metrics && (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-700/10 ring-inset">
                  Score: {response.metrics.overallScore?.toFixed(2)}
                </span>
              )}
            </div>
            <div className="bg-muted rounded p-3 text-sm">
              {response.content}
            </div>
            {response.metrics && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
                <div>
                  <span className="font-medium">Coherence:</span>{' '}
                  {response.metrics.coherenceScore?.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Completeness:</span>{' '}
                  {response.metrics.completenessScore?.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Length:</span>{' '}
                  {response.metrics.lengthScore?.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Structure:</span>{' '}
                  {response.metrics.structureScore?.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Vocabulary:</span>{' '}
                  {response.metrics.vocabularyScore?.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, responses.length)}{' '}
            of {responses.length} responses
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
