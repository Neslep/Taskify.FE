import type { DropResult } from 'react-beautiful-dnd';

import { useState } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { mockTasks, mockColumns } from 'src/_mock/_mockKanban';

import { Iconify } from 'src/components/iconify';

import { KanbanDndContext } from './kanban-dnd-context';

export function KanbanView() {
  const [columns, setColumns] = useState(mockColumns);
  const [tasks] = useState(mockTasks);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = columns.find((col) => col.id === source.droppableId);
    const destCol = columns.find((col) => col.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    const sourceTasks = Array.from(sourceCol.taskIds);
    const destTasks = Array.from(destCol.taskIds);

    sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, result.draggableId);

    const newColumns = columns.map((col) => {
      if (col.id === source.droppableId) {
        return { ...col, taskIds: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, taskIds: destTasks };
      }
      return col;
    });

    setColumns(newColumns);
  };

  // Map columns with their tasks before passing to DndContext
  const columnsWithTasks = columns.map((column) => ({
    ...column,
    tasks: column.taskIds.map((taskId) => tasks[taskId]),
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" flexGrow={1}>
          Kanban Board
        </Typography>

        <Button variant="contained" color='inherit' startIcon={<Iconify icon="eva:plus-fill" />}>
          Add Task
        </Button>
      </Box>

      <KanbanDndContext columns={columnsWithTasks} onDragEnd={handleDragEnd} />
    </Box>
  );
}
