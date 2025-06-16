import React, { useState, useRef } from 'react';
import { ChevronRight, FileText, Type, Square, Image, Download, Code } from 'lucide-react';

// Types
interface ProjectConfig {
  useRouter: boolean;
  useRTKQuery: boolean;
}

interface Component {
  id: string;
  type: 'text' | 'button' | 'input' | 'image' | 'container';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles?: React.CSSProperties;
}

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  components: Component[];
}

// Component Library
const ComponentLibrary = ({ onSelectComponent }: { onSelectComponent: (type: Component['type']) => void }) => {
  const components = [
    { type: 'text' as const, icon: Type, label: 'Text' },
    { type: 'button' as const, icon: Square, label: 'Button' },
    { type: 'input' as const, icon: Type, label: 'Input' },
    { type: 'image' as const, icon: Image, label: 'Image' },
    { type: 'container' as const, icon: Square, label: 'Container' }
  ];

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
      <h3 className="font-bold mb-4">Components</h3>
      <div className="space-y-2">
        {components.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelectComponent(type)}
            className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Canvas Component
const Canvas = ({ components, selectedComponentType, onAddComponent }: {
  components: Component[];
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  selectedComponentType: Component['type'] | null;
  onAddComponent: (component: Component) => void;
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedComponentType || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsSelecting(true);
    setStartPoint({ x, y });
    setSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const newSelection = {
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y)
    };
    
    setSelection(newSelection);
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedComponentType && selection.width > 10 && selection.height > 10) {
      const newComponent: Component = {
        id: Date.now().toString(),
        type: selectedComponentType,
        ...selection,
        content: selectedComponentType === 'text' ? 'Edit me' : 
                 selectedComponentType === 'button' ? 'Click me' : ''
      };
      onAddComponent(newComponent);
    }
    
    setIsSelecting(false);
    setSelection({ x: 0, y: 0, width: 0, height: 0 });
  };

  const renderComponent = (component: Component) => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      left: component.x,
      top: component.y,
      width: component.width,
      height: component.height,
      ...component.styles
    };

    switch (component.type) {
      case 'text':
        return (
          <div key={component.id} style={baseStyles} className="p-2 border border-gray-300">
            <p contentEditable suppressContentEditableWarning>{component.content}</p>
          </div>
        );
      case 'button':
        return (
          <button key={component.id} style={baseStyles} className="bg-blue-500 text-white rounded hover:bg-blue-600">
            {component.content}
          </button>
        );
      case 'input':
        return (
          <input key={component.id} style={baseStyles} className="border border-gray-300 rounded px-2" placeholder="Enter text..." />
        );
      case 'image':
        return (
          <div key={component.id} style={baseStyles} className="bg-gray-200 border border-gray-300 flex items-center justify-center">
            <Image size={32} className="text-gray-400" />
          </div>
        );
      case 'container':
        return (
          <div key={component.id} style={baseStyles} className="border-2 border-dashed border-gray-300 rounded" />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-white relative overflow-hidden cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {components.map(renderComponent)}
      
      {isSelecting && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-20 pointer-events-none"
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height
          }}
        />
      )}
      
      {selectedComponentType && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded">
          Click and drag to place {selectedComponentType}
        </div>
      )}
    </div>
  );
};

// Project Configuration Page
const ProjectConfiguration = ({ onContinue }: { onContinue: (config: ProjectConfig) => void }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    useRouter: false,
    useRTKQuery: false
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Configure Your Project</h2>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.useRouter}
                onChange={(e) => setConfig({ ...config, useRouter: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div>
                <h3 className="font-semibold">React Router DOM</h3>
                <p className="text-gray-600 text-sm">Enable client-side routing for multi-page applications</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.useRTKQuery}
                onChange={(e) => setConfig({ ...config, useRTKQuery: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div>
                <h3 className="font-semibold">RTK Query</h3>
                <p className="text-gray-600 text-sm">Add Redux Toolkit Query for efficient data fetching and caching</p>
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
    </div>
  );
};

// Template Selection Page
const TemplateSelection = ({ onSelectTemplate, onCreateBlank }: {
  onSelectTemplate: (template: Template) => void;
  onCreateBlank: () => void;
}) => {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Landing Page',
      thumbnail: '🏠',
      components: []
    },
    {
      id: '2',
      name: 'Blog Post',
      thumbnail: '📝',
      components: []
    },
    {
      id: '3',
      name: 'Portfolio',
      thumbnail: '💼',
      components: []
    }
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
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
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
};

// Export Modal
const ExportModal = ({ components, config, onClose }: { components: Component[]; config: ProjectConfig; onClose: () => void }) => {
  const [exportType, setExportType] = useState<'html' | 'react' | 'json'>('html');

  const generateHTML = () => {
    const html = components.map(comp => {
      const style = `position: absolute; left: ${comp.x}px; top: ${comp.y}px; width: ${comp.width}px; height: ${comp.height}px;`;
      switch (comp.type) {
        case 'text':
          return `<div style="${style}">${comp.content || 'Text'}</div>`;
        case 'button':
          return `<button style="${style} background: #3B82F6; color: white; border-radius: 4px;">${comp.content || 'Button'}</button>`;
        case 'input':
          return `<input style="${style} border: 1px solid #ccc; padding: 4px;" placeholder="Enter text..." />`;
        case 'image':
          return `<div style="${style} background: #E5E7EB;">Image Placeholder</div>`;
        case 'container':
          return `<div style="${style} border: 2px dashed #ccc;"></div>`;
        default:
          return '';
      }
    }).join('\n    ');

    return `<!DOCTYPE html>
<html>
<head>
    <title>My Web Page</title>
    <style>
        body { margin: 0; padding: 0; position: relative; min-height: 100vh; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
  };

  const generateReact = () => {
    // Start with base React component
    let code = `import React from 'react';\n\n`;
    
    // Add configuration note without mentioning library names
    if (config.useRouter || config.useRTKQuery) {
      code += `/* This component has been configured with additional features.\n`;
      code += ` * See the setup instructions below for implementation details.\n`;
      code += ` */\n\n`;
    }

    code += `export default function MyPage() {\n`;

    // Add placeholder comments without mentioning specific libraries
    if (config.useRouter) {
      code += `  // Navigation hook placeholder\n`;
      code += `  // const navigate = /* add navigation hook here */;\n`;
    }
    
    if (config.useRTKQuery) {
      code += `  // Data fetching hook placeholder\n`;
      code += `  // const { data, error, isLoading } = /* add data hook here */;\n`;
    }

    if (config.useRouter || config.useRTKQuery) {
      code += `\n`;
    }

    code += `  return (\n    <div className="relative min-h-screen">\n`;

    // Add components
    components.forEach(comp => {
      const style = `{{ position: 'absolute', left: ${comp.x}, top: ${comp.y}, width: ${comp.width}, height: ${comp.height} }}`;
      switch (comp.type) {
        case 'text':
          code += `      <div style={${style}}>${comp.content || 'Text'}</div>\n`;
          break;
        case 'button':
          code += `      <button style={${style}} className="bg-blue-500 text-white rounded">${comp.content || 'Button'}</button>\n`;
          break;
        case 'input':
          code += `      <input style={${style}} className="border px-2" placeholder="Enter text..." />\n`;
          break;
        case 'image':
          code += `      <div style={${style}} className="bg-gray-200">Image</div>\n`;
          break;
        case 'container':
          code += `      <div style={${style}} className="border-2 border-dashed border-gray-300" />\n`;
          break;
      }
    });

    code += `    </div>\n  );\n}`;
    
    return code;
  };

  const generateProjectStructure = () => {
    if (exportType !== 'react') return '';
    if (!config.useRouter && !config.useRTKQuery) return '';

    let structure = `\n\n/* SETUP INSTRUCTIONS\n\n`;
    structure += `Your component is configured with the following features:\n`;
    
    if (config.useRouter) {
      structure += `\n[ROUTING ENABLED]\n`;
      structure += `1. Install the routing package for React\n`;
      structure += `2. Wrap your app with a Router component\n`;
      structure += `3. Add navigation hooks where indicated in the code\n`;
    }
    
    if (config.useRTKQuery) {
      structure += `\n[DATA FETCHING ENABLED]\n`;
      structure += `1. Install Redux Toolkit and configure a store\n`;
      structure += `2. Create an API service with endpoints\n`;
      structure += `3. Add data fetching hooks where indicated in the code\n`;
    }
    
    structure += `\nFor detailed implementation, refer to:\n`;
    if (config.useRouter) structure += `- React routing documentation\n`;
    if (config.useRTKQuery) structure += `- Redux Toolkit Query documentation\n`;
    
    structure += `\n*/`;
    
    return structure;
  };

  const generateJSON = () => {
    return JSON.stringify({ config, components }, null, 2);
  };

  const getExportContent = () => {
    switch (exportType) {
      case 'html': return generateHTML();
      case 'react': return generateReact() + generateProjectStructure();
      case 'json': return generateJSON();
    }
  };

  const downloadFile = () => {
    const content = getExportContent();
    const fileType = exportType === 'html' ? 'html' : exportType === 'react' ? 'tsx' : 'json';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-page.${fileType}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Export Your Design</h2>
        
        {(config.useRouter || config.useRTKQuery) && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Configured with:</strong> 
              {[config.useRouter && 'React Router', config.useRTKQuery && 'RTK Query'].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setExportType('html')}
            className={`px-4 py-2 rounded ${exportType === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            HTML
          </button>
          <button
            onClick={() => setExportType('react')}
            className={`px-4 py-2 rounded ${exportType === 'react' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            React Component
          </button>
          <button
            onClick={() => setExportType('json')}
            className={`px-4 py-2 rounded ${exportType === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            JSON Data
          </button>
        </div>

        <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
          <code>{getExportContent()}</code>
        </pre>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={downloadFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

// Editor Page
const Editor = ({ template, config, onGoHome }: { template?: Template; config: ProjectConfig; onGoHome: () => void }) => {
  const [components, setComponents] = useState<Component[]>(template?.components || []);
  const [selectedComponentType, setSelectedComponentType] = useState<Component['type'] | null>(null);
  const [showExport, setShowExport] = useState(false);

  const handleAddComponent = (component: Component) => {
    setComponents([...components, component]);
    setSelectedComponentType(null);
  };

  const handleUpdateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className="h-screen flex flex-col">
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
      <div className="flex-1 flex">
        <ComponentLibrary onSelectComponent={setSelectedComponentType} />
        <Canvas 
          components={components}
          onUpdateComponent={handleUpdateComponent}
          selectedComponentType={selectedComponentType}
          onAddComponent={handleAddComponent}
        />
      </div>
      {showExport && (
        <ExportModal components={components} config={config} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'config' | 'templates' | 'editor'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({ useRouter: false, useRTKQuery: false });

  const handleGetStarted = () => setCurrentPage('config');
  const handleConfigContinue = (config: ProjectConfig) => {
    setProjectConfig(config);
    setCurrentPage('templates');
  };
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentPage('editor');
  };
  const handleCreateBlank = () => setCurrentPage('editor');

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Web Page Builder</h1>
          <p className="text-xl text-gray-600 mb-8">Create beautiful web pages with our drag-and-drop builder</p>
          
          <div className="space-x-4">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2">
              <FileText size={20} />
              Documentation
            </button>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'config') {
    return <ProjectConfiguration onContinue={handleConfigContinue} />;
  }

  if (currentPage === 'templates') {
    return <TemplateSelection onSelectTemplate={handleSelectTemplate} onCreateBlank={handleCreateBlank} />;
  }

  return <Editor template={selectedTemplate} config={projectConfig} onGoHome={() => setCurrentPage('home')} />;
}