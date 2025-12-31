import { useState } from 'react';
import type { ProjectConfig } from '../types';

interface ProjectConfigurationProps {
  onContinue(config: ProjectConfig): void;
}

export default function ProjectConfiguration({
  onContinue,
}: ProjectConfigurationProps) {
  const [config, setConfig] = useState<ProjectConfig>({
    useRouter: false,
    useRTKQuery: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-3xl font-bold mb-4">Configure Your Project</h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.useRouter}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, useRouter: e.target.checked }))
              }
              className="mt-1 h-5 w-5 text-blue-600"
            />
            <div>
              <h3 className="font-semibold">React Router DOM</h3>
              <p className="text-gray-600 text-sm">
                Enable client-side routing for multi-page applications
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.useRTKQuery}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, useRTKQuery: e.target.checked }))
              }
              className="mt-1 h-5 w-5 text-blue-600"
            />
            <div>
              <h3 className="font-semibold">RTK Query</h3>
              <p className="text-gray-600 text-sm">
                Add Redux Toolkit Query for efficient data fetching and caching
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={() => onContinue(config)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Editor
          </button>
        </div>
      </div>
    </div>
  );
}
