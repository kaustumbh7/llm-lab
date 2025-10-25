'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

interface MetricsVisualizationProps {
  responses: ExperimentResponse[];
}

export function MetricsVisualization({ responses }: MetricsVisualizationProps) {
  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Metrics Visualization</CardTitle>
          <CardDescription>No data available for visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No responses available to visualize metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = responses.map((response, index) => ({
    index: index + 1,
    temperature: response.temperature,
    topP: response.topP,
    topK: response.topK,
    maxTokens: response.maxTokens,
    overallScore: response.metrics?.overallScore || 0,
    coherenceScore: response.metrics?.coherenceScore || 0,
    completenessScore: response.metrics?.completenessScore || 0,
    lengthScore: response.metrics?.lengthScore || 0,
    structureScore: response.metrics?.structureScore || 0,
    vocabularyScore: response.metrics?.vocabularyScore || 0,
  }));

  // Calculate average scores
  const avgScores = {
    overall:
      chartData.reduce((sum, item) => sum + item.overallScore, 0) /
      chartData.length,
    coherence:
      chartData.reduce((sum, item) => sum + item.coherenceScore, 0) /
      chartData.length,
    completeness:
      chartData.reduce((sum, item) => sum + item.completenessScore, 0) /
      chartData.length,
    length:
      chartData.reduce((sum, item) => sum + item.lengthScore, 0) /
      chartData.length,
    structure:
      chartData.reduce((sum, item) => sum + item.structureScore, 0) /
      chartData.length,
    vocabulary:
      chartData.reduce((sum, item) => sum + item.vocabularyScore, 0) /
      chartData.length,
  };

  return (
    <div className="space-y-6">
      {/* Average Scores Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Average Scores</CardTitle>
          <CardDescription>
            Overall performance across all responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {avgScores.overall.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {avgScores.coherence.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {avgScores.completeness.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Completeness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {avgScores.length.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {avgScores.structure.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Structure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {avgScores.vocabulary.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm">Vocabulary</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Trend</CardTitle>
          <CardDescription>
            How overall scores vary across responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  formatter={(value: number) => [
                    value.toFixed(2),
                    'Overall Score',
                  ]}
                  labelFormatter={(label) => `Response ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="overallScore"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics Breakdown</CardTitle>
          <CardDescription>
            Individual metric scores across responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toFixed(2),
                    name
                      .replace('Score', '')
                      .replace(/([A-Z])/g, ' $1')
                      .trim(),
                  ]}
                  labelFormatter={(label) => `Response ${label}`}
                />
                <Bar dataKey="coherenceScore" fill="#10b981" name="Coherence" />
                <Bar
                  dataKey="completenessScore"
                  fill="#8b5cf6"
                  name="Completeness"
                />
                <Bar dataKey="lengthScore" fill="#f59e0b" name="Length" />
                <Bar dataKey="structureScore" fill="#ef4444" name="Structure" />
                <Bar
                  dataKey="vocabularyScore"
                  fill="#6366f1"
                  name="Vocabulary"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Parameter vs Score Correlation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temperature vs Overall Score</CardTitle>
            <CardDescription>
              Correlation between temperature and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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

        <Card>
          <CardHeader>
            <CardTitle>Top-P vs Overall Score</CardTitle>
            <CardDescription>
              Correlation between top-p and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="topP"
                    name="Top-P"
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
                      name === 'overallScore' ? 'Overall Score' : 'Top-P',
                    ]}
                  />
                  <Scatter dataKey="overallScore" fill="#10b981" r={6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
