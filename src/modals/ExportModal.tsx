

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { ComponentShape, ProjectConfig } from '../types';

type ExportKind = 'html' | 'react' | 'json';

interface ExportModalProps {
  components: ComponentShape[];
  config: ProjectConfig;
  onClose(): void;
}

/**
 * Renders a modal that lets the user export their design to
 * plain HTML, a typed React component, or raw JSON.
 *
 * NOTE: Pure UI – state is local; parent controls visibility.
 */
export default function ExportModal({
  components,
  config,
  onClose,
}: ExportModalProps) {
  const [exportType, setExportType] = useState<ExportKind>('html');

  /* ---------------------------------------------------------------------- */
  /* Generators                                                              */
  /* ---------------------------------------------------------------------- */

  /** Build static HTML with inline styles (no frameworks). */
  const generateHTML = () => {
    const htmlBody = components
      .map((c) => {
        const style = `position:absolute;left:${c.x}px;top:${c.y}px;width:${c.width}px;height:${c.height}px;`;
        switch (c.type) {
          case 'text':
            return `<div style="${style}">${c.content || 'Text'}</div>`;
          case 'button':
            return `<button style="${style}background:#3B82F6;color:white;border-radius:4px;">${c.content || 'Button'}</button>`;
          case 'input':
            return `<input style="${style}border:1px solid #ccc;padding:4px;" placeholder="Enter text..." />`;
          case 'image':
            return `<div style="${style}background:#E5E7EB;">Image Placeholder</div>`;
          case 'container':
            return `<div style="${style}border:2px dashed #ccc;"></div>`;
          default:
            return '';
        }
      })
      .join('\n    ');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>My Web Page</title>
  <style>body{margin:0;padding:0;position:relative;min-height:100vh;}</style>
</head>
<body>
    ${htmlBody}
</body>
</html>`;
  };

  /** Build a functional React component (*.tsx) */
  const generateReact = () => {
    let code = `import React from 'react';\n\n`;

    // Feature annotation
    if (config.useRouter || config.useRTKQuery) {
      code += `/*\n * This file is pre‑wired for optional features.\n`;
      if (config.useRouter) code += ` *  - React Router\n`;
      if (config.useRTKQuery) code += ` *  - RTK Query\n`;
      code += ` */\n\n`;
    }

    code += `export default function MyPage() {\n`;

    if (config.useRouter) {
      code += `  // const navigate = useNavigate(); // add from react-router-dom\n`;
    }
    if (config.useRTKQuery) {
      code += `  // const { data, error, isLoading } = myApi.useGetSomethingQuery();\n`;
    }
    if (config.useRouter || config.useRTKQuery) code += `\n`;

    code += `  return (\n    <div className="relative min-h-screen">\n`;

    components.forEach((c) => {
      const style = `{{ position: 'absolute', left: ${c.x}, top: ${c.y}, width: ${c.width}, height: ${c.height} }}`;
      switch (c.type) {
        case 'text':
          code += `      <div style={${style}}>${c.content || 'Text'}</div>\n`;
          break;
        case 'button':
          code += `      <button style={${style}} className="bg-blue-500 text-white rounded">${c.content || 'Button'}</button>\n`;
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

    code += `    </div>\n  );\n}\n`;

    /* optional instructions appendix */
    if (config.useRouter || config.useRTKQuery) {
      code += `\n/*\nSETUP INSTRUCTIONS\n`;
      if (config.useRouter) {
        code += `1. Install react-router‑dom and wrap <MyPage /> with <BrowserRouter> in your root.\n`;
      }
      if (config.useRTKQuery) {
        code += `2. Configure Redux store and inject endpoints via createApi().\n`;
      }
      code += `*/`;
    }

    return code;
  };

  /** Serialize the design for later reload */
  const generateJSON = () =>
    JSON.stringify({ config, components }, null, 2);

  const getExportContent = () => {
    switch (exportType) {
      case 'html':
        return generateHTML();
      case 'react':
        return generateReact();
      case 'json':
        return generateJSON();
      default:
        return '';
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Utilities                                                               */
  /* ---------------------------------------------------------------------- */

  const downloadFile = () => {
    const text = getExportContent();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-page.${
      exportType === 'react' ? 'tsx' : exportType === 'html' ? 'html' : 'json'
    }`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Export Your Design</h2>

        {(config.useRouter || config.useRTKQuery) && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Configured with:</strong>{' '}
              {[config.useRouter && 'React Router', config.useRTKQuery && 'RTK Query']
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}

        {/* export-type tabs */}
        <div className="flex gap-2 mb-4">
          {(['html', 'react', 'json'] as ExportKind[]).map((kind) => (
            <button
              key={kind}
              onClick={() => setExportType(kind)}
              className={`px-4 py-2 rounded ${
                exportType === kind
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {kind.toUpperCase()}
            </button>
          ))}
        </div>

        <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto text-xs leading-5">
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
}