// src/sections/userProject/projectDetail/project-table-row.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { Gender, TaskStatus, PriorityLevel } from '../../../types/enum';

import type { TaskProps } from '../../../types/project';

type ProjectTableRowProps = {
  row: TaskProps;
  selected: boolean;
  onSelectRow: () => void;
};
function mapPriorityToText(priority: PriorityLevel): string {
  switch (priority) {
    case PriorityLevel.High:
      return 'High';
    case PriorityLevel.Medium:
      return 'Medium';
    case PriorityLevel.Low:
      return 'Low';
    default:
      return 'Unknown';
  }
}



function mapStatusToText(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.ToDo:
      return 'To Do';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Done:
      return 'Done';
    case TaskStatus.Cancelled:
      return 'Cancelled';
    case TaskStatus.Pending:
      return 'Pending';
    default:
      return 'Unknown';
  }
}
function getAvatarUrl(gender: Gender | string): string {
  switch (gender) {
    case Gender.FeMale:
      return 'assets/images/avatar/avatar-25.webp';
    case Gender.Male:
      return 'assets/images/avatar/avatar-1.webp';
    default:
      return 'assets/images/avatar/avatar-23.webp';
  }
}



export function ProjectTableRow({ row, selected, onEditRow, onDeleteRow, onSelectRow }: ProjectTableRowProps & { onEditRow: () => void, onDeleteRow: (id: string) => void }) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>{row.taskName}</TableCell>
        <TableCell>
          {Array.isArray(row.assignee) ? row.assignee.map((assignee: { userName: string, userId: string, gender: Gender | string }, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Typography variant="body2">{assignee.userName}</Typography>
            </Box>
          )) : null}
        </TableCell>
        <TableCell>{row.dueDate.toString()}</TableCell>
        <TableCell>
          <Label color={
            (row.priority === PriorityLevel.High && 'error') ||
            (row.priority === PriorityLevel.Medium && 'warning') ||
            'success'
          }>
            {mapPriorityToText(row.priority)}
          </Label>
        </TableCell>
        <TableCell>
          <Label color={
            (row.status === TaskStatus.Done && 'success') ||
            (row.status === TaskStatus.InProgress && 'warning') ||
            (row.status === TaskStatus.ToDo && 'info') ||
            (row.status === TaskStatus.Cancelled && 'error') ||
            (row.status === TaskStatus.Pending && 'default') ||
            undefined
          }>
            {mapStatusToText(row.status)}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={() => { handleClosePopover(); onEditRow(); }}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => { handleClosePopover(); onDeleteRow(row.id); }}sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
