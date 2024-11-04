import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  Box,
  Dialog,
  Button,
  Toolbar,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  DialogContentText,
} from '@mui/material';

import { mockProjectMembers } from 'src/_mock/_mockProjectMembers';

import { Iconify } from 'src/components/iconify';

import ProjectMembersDialog from './member-dialog';

type ProjectTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ProjectTableToolbar({
  numSelected,
  filterName,
  onFilterName,
}: ProjectTableToolbarProps) {
  const [open, setOpen] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [members, setMembers] = useState(mockProjectMembers);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // Thêm logic xóa ở đây
    setOpen(false);
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, role: newRole as 'admin' | 'member' | 'viewer' }
          : member
      )
    );
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search project..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}

        {numSelected > 0 ? (
          <>
            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the selected items?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
                  Delete
                </Button>
                <Button onClick={handleClose} variant="outlined" color="inherit">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Filter list">
              <IconButton>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Members">
              <IconButton onClick={() => setOpenMemberDialog(true)}>
                <Iconify icon="ic:round-people" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
      <ProjectMembersDialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        members={members}
        onUpdateRole={handleUpdateRole}
        onAddMember={(email: string) => {}}
        onRemoveMember={(memberId: string) => {
          setMembers(members.filter((member) => member.id !== memberId));
        }}
      />
    </>
  );
}
