import type { KanbanTaskData, KanbanColumnData } from 'src/_mock/_mockKanban';

import { Draggable } from 'react-beautiful-dnd';

import { alpha } from '@mui/material/styles';
import { Paper, Stack, Typography } from '@mui/material';

import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  column: KanbanColumnData & {
    tasks: KanbanTaskData[]; // Added from parent mapping
  };
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  return (
    <Paper
      sx={{
        width: 280,
        p: 2.5,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {column.name}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {column.taskIds.length} tasks
          </Typography>
        </Stack>

        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  opacity: snapshot.isDragging ? 0.8 : 1,
                }}
              >
                <KanbanCard task={task} />
              </div>
            )}
          </Draggable>
        ))}
      </Stack>
    </Paper>
  );
}
