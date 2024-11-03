import type { DropResult } from 'react-beautiful-dnd';
import type { KanbanTaskData, KanbanColumnData } from 'src/_mock/_mockKanban';

import { Droppable, DragDropContext } from 'react-beautiful-dnd';

import { Box } from '@mui/material';

import { KanbanColumn } from './kanban-column';

interface KanbanDndContextProps {
  columns: Array<
    KanbanColumnData & {
      tasks: KanbanTaskData[]; // Added tasks from parent mapping
    }
  >;
  onDragEnd: (result: DropResult) => void;
}

export function KanbanDndContext({ columns, onDragEnd }: KanbanDndContextProps) {
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
                <KanbanColumn column={column} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
}
