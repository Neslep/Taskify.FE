import type { KanbanTaskData } from 'src/_mock/_mockKanban';

import { styled } from '@mui/material/styles';
import { Card, Chip, Stack, Avatar, Typography } from '@mui/material';

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

interface Props {
  task: KanbanTaskData;
}

export function KanbanCard({ task }: Props) {
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
      </Stack>
    </StyledCard>
  );
}
