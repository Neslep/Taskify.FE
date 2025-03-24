import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ProjectStatus } from 'src/types/enum';

import type { ProjectTableRowProps } from '../../types/project';

function mapStatusToText(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.NotStarted:
      return 'Not Started';
    case ProjectStatus.InProgress:
      return 'In Progress';
    case ProjectStatus.Completed:
      return 'Completed';
    default:
      return 'Unknown';
  }
}

export function ProjectTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }: ProjectTableRowProps & { onEditRow: () => void, onDeleteRow: (id: string) => void }) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleViewProject = () => {
    handleClosePopover();
    navigate('/projects/projectDetail', { state: { project: row } });
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>

        <TableCell>{row.description}</TableCell>

        <TableCell>
          <Label color={(row.status === ProjectStatus.Completed && 'success') || 'warning'}>
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
          <MenuItem onClick={handleViewProject}>
            <Iconify icon="mdi:eye" />
            View
          </MenuItem>
          <MenuItem onClick={() => { handleClosePopover(); onEditRow(); }}>
            <Iconify icon="mdi:pencil" />
            Edit
          </MenuItem>
          <MenuItem sx={{ color: 'error.main' }} onClick={() => { handleClosePopover(); onDeleteRow(row.id); }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}