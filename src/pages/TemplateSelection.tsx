import type { Template } from '../types';

interface TemplateSelectionProps {
  onSelectTemplate(template: Template): void;
  onCreateBlank(): void;
}

export default function TemplateSelection({
  onSelectTemplate,
  onCreateBlank,
}: TemplateSelectionProps) {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Landing Page',
      thumbnail: '🏠',
      components: [],
    },
    {
      id: '2',
      name: 'Blog Post',
      thumbnail: '📝',
      components: [],
    },
    {
      id: '3',
      name: 'Portfolio',
      thumbnail: '💼',
      components: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Choose a Template</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
            >
              <div className="text-6xl mb-4">{template.thumbnail}</div>
              <h3 className="font-semibold">{template.name}</h3>
            </button>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={onCreateBlank}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Start with Blank Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
