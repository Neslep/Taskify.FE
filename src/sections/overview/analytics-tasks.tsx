import type { CardProps } from '@mui/material/Card';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Task = {
  id: string;
  name: string;
  completed: boolean;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

export function AnalyticsTasks({ title, subheader, sx, ...other }: Props) {
  // 🟢 FIXED: Lấy dữ liệu từ localStorage khi khởi tạo state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');

  // 🔵 FIXED: Lưu vào localStorage mỗi khi task thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Thêm task mới
  const addTask = () => {
    if (!newTask.trim()) return;
    const newTaskItem: Task = {
      id: Date.now().toString(),
      name: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskItem]);
    setNewTask('');
  };

  // ✅ Toggle hoàn thành task
  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  // ✅ Xóa task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <Card {...other} sx={{ minHeight: '100%', ...sx }}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      {/* 🔹 Form nhập task */}
      <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Ngăn form submit mặc định
              addTask(); // Gọi hàm thêm task
            }
          }}
        />
        <Button variant="contained" color="inherit" onClick={addTask}>
          Add
        </Button>
      </Box>

      {/* 🔹 Danh sách task */}
      <Scrollbar sx={{ height: 250 }}>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          {[...tasks]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Box
      sx={{
        pl: 2,
        pr: 1,
        py: 1.5,
        display: 'flex',
        ...(task.completed && { color: 'text.disabled', textDecoration: 'line-through' }),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            disableRipple
            checked={task.completed}
            onChange={onToggle}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
          />
        }
        label={task.name}
        sx={{ m: 0, flexGrow: 1 }}
      />

      <IconButton color="error" onClick={onDelete}>
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>
    </Box>
  );
}
