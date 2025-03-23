import type { AlertColor } from '@mui/material';
import type { DropResult } from 'react-beautiful-dnd';

import { useState, useEffect } from 'react';

import { Box, Alert, Button, Snackbar, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { TaskModal } from 'src/sections/kanban/task-modal';

import { KanbanDndContext } from './kanban-dnd-context';

import type { KanbanTaskData } from './kanban-card';

// --------------------------------------------------

export interface ColumnData {
  id: string;
  name: string;
  tasks: KanbanTaskData[];
}

const defaultColumns: ColumnData[] = [
  { id: 'column-1', name: 'To Do', tasks: [] },
  { id: 'column-2', name: 'In Progress', tasks: [] },
  { id: 'column-3', name: 'Done', tasks: [] },
];

export function KanbanView() {
  const [columns, setColumns] = useState<ColumnData[]>(() => {
    const saved = localStorage.getItem('kanbanColumns');
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  // Modal state cho thêm/sửa task
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingTask, setEditingTask] = useState<{ columnId: string; task: KanbanTaskData } | null>(
    null
  );

  // Snackbar state (updated to match your example)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  // Cập nhật localStorage mỗi khi columns thay đổi
  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);

  // Show snackbar with message
  const showSnackbar = (message: string, severity: AlertColor = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Drag & drop handler
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newColumns = [...columns];
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId);
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId);
    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceTasks = Array.from(newColumns[sourceColIndex].tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceColIndex === destColIndex) {
      sourceTasks.splice(destination.index, 0, movedTask);
      newColumns[sourceColIndex].tasks = sourceTasks;
    } else {
      const destTasks = Array.from(newColumns[destColIndex].tasks);
      destTasks.splice(destination.index, 0, movedTask);
      newColumns[sourceColIndex].tasks = sourceTasks;
      newColumns[destColIndex].tasks = destTasks;
    }
    setColumns(newColumns);
  };

  // Mở modal để thêm task mới
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setModalType('add');
    setModalOpen(true);
  };

  // Xóa task khỏi cột tương ứng
  const handleDeleteTask = (columnId: string, taskId: string) => {
    const columnIndex = columns.findIndex((col) => col.id === columnId);
    if (columnIndex === -1) return;

    const taskIndex = columns[columnIndex].tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const taskName = columns[columnIndex].tasks[taskIndex].name;
    const columnName = columns[columnIndex].name;

    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) };
      }
      return col;
    });

    setColumns(newColumns);
    showSnackbar(`Task "${taskName}" deleted from ${columnName}`, 'success');
  };

  // Mở modal để sửa task
  const handleEditTask = (columnId: string, taskId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    const task = column.tasks.find((t) => t.id === taskId);
    if (!task) return;
    setEditingTask({ columnId, task });
    setModalType('edit');
    setModalOpen(true);
  };

  // Xử lý khi modal lưu dữ liệu
  const handleModalSave = (data: {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (modalType === 'add') {
      const newTask: KanbanTaskData = { id: Date.now().toString(), ...data };
      // Thêm task mới vào cột đầu tiên (To Do) theo mặc định
      const newColumns = columns.map((col, index) => {
        if (index === 0) return { ...col, tasks: [...col.tasks, newTask] };
        return col;
      });
      setColumns(newColumns);
      showSnackbar(`New task "${data.name}" added to ${columns[0].name}`, 'success');
    } else if (modalType === 'edit' && editingTask) {
      const columnIndex = columns.findIndex((col) => col.id === editingTask.columnId);
      if (columnIndex === -1) return;

      const columnName = columns[columnIndex].name;

      const newColumns = columns.map((col) => {
        if (col.id === editingTask.columnId) {
          const newTasks = col.tasks.map((task) =>
            task.id === editingTask.task.id ? { ...task, ...data } : task
          );
          return { ...col, tasks: newTasks };
        }
        return col;
      });
      setColumns(newColumns);
      showSnackbar(`Task "${data.name}" updated in ${columnName}`, 'success');
    }
    setModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" flexGrow={1}>
          Kanban Board
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAddTask}
        >
          Add Task
        </Button>
      </Box>
      <KanbanDndContext
        columns={columns}
        onDragEnd={handleDragEnd}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />
      <TaskModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialTask={
          editingTask
            ? {
                name: editingTask.task.name,
                description: editingTask.task.description,
                priority: editingTask.task.priority,
              }
            : undefined
        }
        isEdit={modalType === 'edit'}
      />

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
