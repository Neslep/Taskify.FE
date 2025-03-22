import type { DropResult } from 'react-beautiful-dnd';

import { Droppable, DragDropContext } from 'react-beautiful-dnd';

import { Box } from '@mui/material';

import { KanbanColumn } from './kanban-column';

interface KanbanDndContextProps {
  columns: Array<{
    id: string;
    name: string;
    tasks: any[];
  }>;
  onDragEnd: (result: DropResult) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onEditTask: (columnId: string, taskId: string) => void;
}

export function KanbanDndContext({
  columns,
  onDragEnd,
  onDeleteTask,
  onEditTask,
}: KanbanDndContextProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          p: 3,
          minHeight: '100%',
        }}
      >
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                  padding: 8,
                  minHeight: 500,
                  width: 280,
                }}
              >
                <KanbanColumn column={column} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
}
