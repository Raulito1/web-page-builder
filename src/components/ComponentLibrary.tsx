import { Type, Square, Image } from 'lucide-react';
import type { ComponentShape } from '../types';

interface Props {
  onSelectComponent(type: ComponentShape['type']): void;
}

const palette = [
  { type: 'text' as const, icon: Type, label: 'Text' },
  { type: 'button' as const, icon: Square, label: 'Button' },
  { type: 'input' as const, icon: Type, label: 'Input' },
  { type: 'image' as const, icon: Image, label: 'Image' },
  { type: 'container' as const, icon: Square, label: 'Container' },
];

export default function ComponentLibrary({ onSelectComponent }: Props) {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300">
      <h3 className="font-bold mb-4">Components</h3>
      <div className="space-y-2">
        {palette.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelectComponent(type)}
            className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md flex items-center gap-3"
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}