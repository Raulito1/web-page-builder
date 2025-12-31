// src/components/Canvas.tsx
import { useDroppable } from '@dnd-kit/core';

export function Canvas({
  id,
  children,
  className,
  style,
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      id={id}
      ref={setNodeRef}
      className={`relative p-4 border-2 border-dashed ${
        isOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
      } ${className ?? ''}`}
      style={{ minHeight: '400px', ...style }}
    >
      {children}
    </div>
  );
}
