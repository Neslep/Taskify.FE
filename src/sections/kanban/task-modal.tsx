import { useState, useEffect } from 'react';

import {
  Stack,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material';

// --------------------------------------------------

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
    if (name.trim() === '') return; // simple validation
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
          <FormControl fullWidth>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            <FormHelperText>Select the task priority level</FormHelperText>
          </FormControl>
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
