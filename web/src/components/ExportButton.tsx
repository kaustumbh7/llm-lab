'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { exportExperiment } from '@/lib/api';

interface ExportButtonProps {
  experimentId: string;
}

export function ExportButton({ experimentId }: ExportButtonProps) {
  const handleExport = async () => {
    try {
      const data = await exportExperiment(experimentId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment-${experimentId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export JSON
    </Button>
  );
}
