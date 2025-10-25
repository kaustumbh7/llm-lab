'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ExperimentResponse } from '@/lib/types';

interface ParameterAnalysisProps {
  responses: ExperimentResponse[];
}

export function ParameterAnalysis({ responses }: ParameterAnalysisProps) {
  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameter Analysis</CardTitle>
          <CardDescription>No data available for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No responses available to analyze parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for parameter analysis
  const chartData = responses.map((response, index) => ({
    index: index + 1,
    temperature: response.temperature,
    topP: response.topP,
    topK: response.topK,
    maxTokens: response.maxTokens,
    overallScore: response.metrics?.overallScore || 0,
  }));

  // Calculate parameter statistics
  const tempStats = {
    min: Math.min(...chartData.map((d) => d.temperature)),
    max: Math.max(...chartData.map((d) => d.temperature)),
    avg:
      chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length,
  };

  const topPStats = {
    min: Math.min(...chartData.map((d) => d.topP)),
    max: Math.max(...chartData.map((d) => d.topP)),
    avg: chartData.reduce((sum, d) => sum + d.topP, 0) / chartData.length,
  };

  const topKStats = {
    min: Math.min(...chartData.map((d) => d.topK)),
    max: Math.max(...chartData.map((d) => d.topK)),
    avg: chartData.reduce((sum, d) => sum + d.topK, 0) / chartData.length,
  };

  const tokensStats = {
    min: Math.min(...chartData.map((d) => d.maxTokens)),
    max: Math.max(...chartData.map((d) => d.maxTokens)),
    avg: chartData.reduce((sum, d) => sum + d.maxTokens, 0) / chartData.length,
  };

  // Find best performing response
  const bestResponse = chartData.reduce((best, current) =>
    current.overallScore > best.overallScore ? current : best,
  );

  return (
    <div className="space-y-6">
      {/* Parameter Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Statistics</CardTitle>
          <CardDescription>
            Range and average values for each parameter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <h4 className="mb-2 font-semibold text-blue-600">Temperature</h4>
              <div className="space-y-1 text-sm">
                <div>Min: {tempStats.min.toFixed(3)}</div>
                <div>Max: {tempStats.max.toFixed(3)}</div>
                <div>Avg: {tempStats.avg.toFixed(3)}</div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-green-600">Top-P</h4>
              <div className="space-y-1 text-sm">
                <div>Min: {topPStats.min.toFixed(3)}</div>
                <div>Max: {topPStats.max.toFixed(3)}</div>
                <div>Avg: {topPStats.avg.toFixed(3)}</div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-purple-600">Top-K</h4>
              <div className="space-y-1 text-sm">
                <div>Min: {topKStats.min}</div>
                <div>Max: {topKStats.max}</div>
                <div>Avg: {topKStats.avg.toFixed(1)}</div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-orange-600">Max Tokens</h4>
              <div className="space-y-1 text-sm">
                <div>Min: {tokensStats.min}</div>
                <div>Max: {tokensStats.max}</div>
                <div>Avg: {tokensStats.avg.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Performing Response */}
      <Card>
        <CardHeader>
          <CardTitle>Best Performing Response</CardTitle>
          <CardDescription>
            Parameters that achieved the highest overall score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bestResponse.temperature.toFixed(3)}
              </div>
              <div className="text-muted-foreground text-sm">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bestResponse.topP.toFixed(3)}
              </div>
              <div className="text-muted-foreground text-sm">Top-P</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {bestResponse.topK}
              </div>
              <div className="text-muted-foreground text-sm">Top-K</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {bestResponse.maxTokens}
              </div>
              <div className="text-muted-foreground text-sm">Max Tokens</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {bestResponse.overallScore.toFixed(2)}
            </div>
            <div className="text-muted-foreground text-sm">Overall Score</div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Distribution</CardTitle>
            <CardDescription>
              How temperature values are distributed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis domain={['dataMin', 'dataMax']} />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toFixed(3),
                      'Temperature',
                    ]}
                    labelFormatter={(label) => `Response ${label}`}
                  />
                  <Bar dataKey="temperature" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top-P Distribution</CardTitle>
            <CardDescription>How top-p values are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis domain={['dataMin', 'dataMax']} />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(3), 'Top-P']}
                    labelFormatter={(label) => `Response ${label}`}
                  />
                  <Bar dataKey="topP" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parameter Correlation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Correlation</CardTitle>
          <CardDescription>
            How parameters relate to overall performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="temperature"
                  name="Temperature"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  dataKey="overallScore"
                  name="Overall Score"
                  domain={[0, 10]}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'overallScore'
                      ? value.toFixed(2)
                      : value.toFixed(3),
                    name === 'overallScore' ? 'Overall Score' : 'Temperature',
                  ]}
                />
                <Scatter dataKey="overallScore" fill="#3b82f6" r={6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
