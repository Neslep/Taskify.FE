import { styled } from '@mui/material/styles';
import { Card, Chip, Stack, Avatar, Button, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: theme.transitions.create('transform'),
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

// Định nghĩa kiểu dữ liệu cho task (có thể tùy chỉnh thêm các field nếu cần)
export interface KanbanTaskData {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: { name: string; avatar: string };
  attachments?: number;
  comments?: number;
}

interface Props {
  task: KanbanTaskData;
  onDelete: () => void;
  onEdit: () => void;
}

export function KanbanCard({ task, onDelete, onEdit }: Props) {
  return (
    <StyledCard sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle2">{task.name}</Typography>
        {task.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {task.description}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={2}>
          {task.assignee && (
            <Avatar
              src={task.assignee.avatar}
              alt={task.assignee.name}
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Stack direction="row" spacing={1} flexGrow={1}>
            <Chip
              size="small"
              label={task.priority}
              color={
                task.priority === 'high'
                  ? 'error'
                  : task.priority === 'medium'
                    ? 'warning'
                    : 'success'
              }
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {task.attachments && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Iconify icon="eva:attach-2-fill" width={16} />
                <Typography variant="caption">{task.attachments}</Typography>
              </Stack>
            )}
            {task.comments && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Iconify icon="eva:message-circle-fill" width={16} />
                <Typography variant="caption">{task.comments}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </StyledCard>
  );
}
