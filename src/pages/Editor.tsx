import { useState } from 'react';
import { ChevronRight, Code } from 'lucide-react';

import { Canvas } from '../components/Canvas';
import ComponentLibrary from '../components/ComponentLibrary';
import ExportModal from '../modals/ExportModal';

import type { ComponentShape, Template, ProjectConfig } from '../types';

/**
 * WYSIWYG editor page.
 *
 * Responsibilities
 *  • Own local component state (placement, content edits)
 *  • Bridge child callbacks to parent (onGoHome)
 *  • Show ExportModal when requested
 */
interface EditorProps {
  template?: Template;
  config: ProjectConfig;
  onGoHome(): void;
}

export default function Editor({ template, config, onGoHome }: EditorProps) {
  const [components, setComponents] = useState<ComponentShape[]>(
    template?.components ?? [],
  );
  const [selectedComponentType, setSelectedComponentType] =
    useState<ComponentShape['type'] | null>(null);
  const [showExport, setShowExport] = useState(false);

  /* -------------------------------------------------- */
  /* Handlers                                           */
  /* -------------------------------------------------- */

  const handleAddComponent = (component: ComponentShape) => {
    setComponents((prev) => [...prev, component]);
    setSelectedComponentType(null);
  };

  const handleUpdateComponent = (
    id: string,
    updates: Partial<ComponentShape>,
  ) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */

  return (
    <div className="h-screen flex flex-col">
      {/* top bar ------------------------------------------------------ */}
      <header className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back to Home
        </button>

        <h1 className="text-lg font-semibold">Web Page Builder</h1>

        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1 rounded transition-colors"
        >
          <Code size={16} />
          Export
        </button>
      </header>

      {/* main editor -------------------------------------------------- */}
      <div className="flex-1 flex">
        <ComponentLibrary onSelectComponent={setSelectedComponentType} />

        <Canvas
          components={components}
          onUpdateComponent={handleUpdateComponent}
          selectedComponentType={selectedComponentType}
          onAddComponent={handleAddComponent}
        />
      </div>

      {/* modal -------------------------------------------------------- */}
      {showExport && (
        <ExportModal
          components={components}
          config={config}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
