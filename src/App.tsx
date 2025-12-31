
// src/App.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDraggable,
  closestCorners,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Draggable } from './components/Draggable';
import { Canvas } from './components/Canvas';

interface Item {
  id: string;
  type: 'button';
  x: number;
  y: number;
}

function MovableItem({
  id,
  x,
  y,
  children,
}: {
  id: string;
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  console.log(`Rendering ${id} at`, { x, y, transform });

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function App() {
  const [canvasItems, setCanvasItems] = useState<Item[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;

    console.log('handleDragEnd:', {
      activeId: active.id,
      overId: over?.id,
      delta,
      activatorEvent: event.activatorEvent,
    });

    // 1) Move an existing canvas item
    if (canvasItems.some((it) => it.id === active.id)) {
      setCanvasItems((items) =>
        items.map((it) =>
          it.id === active.id
            ? { ...it, x: it.x + delta.x, y: it.y + delta.y }
            : it
        )
      );
      // Return here to avoid further processing
      return;
    }

    // 2) Drop a new palette button into the canvas
    if (over?.id === 'canvas' && typeof active.id === 'string' && active.id.startsWith('button-')) {
      console.log('Dropping new item on canvas');
      const canvasEl = document.getElementById('canvas');
      if (canvasEl && event.activatorEvent instanceof MouseEvent) {
        const { clientX, clientY } = event.activatorEvent;
        const rect = canvasEl.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const newId = `${active.id}-${Date.now()}`;
        setCanvasItems((items) => [
          ...items,
          { id: newId, type: 'button', x, y },
        ]);
      }
    } else {
      if (typeof active.id === 'string' && active.id.startsWith('button-')) {
        console.warn('Drop target is not canvas:', over?.id);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      {/* Palette */}
      <div className="flex gap-4 mb-6">
        <Draggable id="button-1">
          <Button variant="contained">Click me</Button>
        </Draggable>
        <Draggable id="button-2">
          <Button variant="outlined">Action</Button>
        </Draggable>
      </div>

      {/* Canvas */}
      <Canvas
        id="canvas"
        className="absolute top-24 left-8 w-1/2 h-96"
        style={{}}
      >
        {canvasItems.map((item) => (
          <MovableItem key={item.id} id={item.id} x={item.x} y={item.y}>
            <Button variant="contained">Dropped {item.id}</Button>
          </MovableItem>
        ))}
      </Canvas>
    </DndContext>
  );
}