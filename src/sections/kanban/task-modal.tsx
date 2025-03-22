import { useState, useEffect } from 'react';

import {
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  initialTask?: { name: string; description: string; priority: 'low' | 'medium' | 'high' };
  isEdit?: boolean;
}

export function TaskModal({ open, onClose, onSave, initialTask, isEdit = false }: TaskModalProps) {
  const [name, setName] = useState(initialTask?.name || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialTask?.priority || 'low'
  );

  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
    } else {
      setName('');
      setDescription('');
      setPriority('low');
    }
  }, [initialTask, open]);

  const handleSave = () => {
    if (name.trim() === '') return; // validation đơn giản
    onSave({ name, description, priority });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '300px' }}>
          <TextField
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Priority"
            value={priority}
            onChange={(e) => {
              const val = e.target.value as 'low' | 'medium' | 'high';
              setPriority(val);
            }}
            fullWidth
            helperText="Enter low, medium, or high"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
