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
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ProjectProps = {
  [x: string]: any;
  id: string;
  taskName: string;
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'Pending';
  progress: number;
};

type ProjectTableRowProps = {
  row: ProjectProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function ProjectTableRow({ row, selected, onSelectRow }: ProjectTableRowProps) {
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={row.assignee.avatar} sx={{ mr: 2 }} />
            <Typography variant="body2">{row.assignee.name}</Typography>
          </Box>
        </TableCell>
        <TableCell>{row.dueDate}</TableCell>
        <TableCell>
          <Label color={
            (row.priority === 'High' && 'error') ||
            (row.priority === 'Medium' && 'warning') || 
            'success'
          }>
            {row.priority}
          </Label>
        </TableCell>
        <TableCell>
          <Label color={
            (row.status === 'Completed' && 'success') ||
            (row.status === 'In Progress' && 'warning') ||
            'error'
          }>
            {row.status}
          </Label>
        </TableCell>
        <TableCell>
          <LinearProgress 
            variant="determinate"
            value={row.progress}
            sx={{ width: 120 }}
          />
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
          <MenuItem onClick={() => { handleClosePopover(); navigate('/projects/projectDetail'); }}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
