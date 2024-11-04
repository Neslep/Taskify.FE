import type { ProjectMember } from 'src/_mock/_mockProjectMembers';

import { useState } from 'react';

import { Delete } from '@mui/icons-material';
import {
  Box,
  List,
  Dialog,
  Avatar,
  Button,
  Select,
  ListItem,
  MenuItem,
  TextField,
  IconButton,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemAvatar,
} from '@mui/material';

interface ProjectMembersDialogProps {
  open: boolean;
  onClose: () => void;
  members: ProjectMember[];
  onUpdateRole: (memberId: string, newRole: string) => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export default function ProjectMembersDialog({
  open,
  onClose,
  members,
  onUpdateRole,
  onAddMember,
  onRemoveMember,
}: ProjectMembersDialogProps) {
  const [email, setEmail] = useState('');

  const handleAddMember = () => {
    if (email) {
      onAddMember(email);
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Project Members</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member email"
          />
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleAddMember}
            disabled={!email}
            sx={{ width: 150, height: 40 }}
          >
            Add Member
          </Button>
        </Box>
        <List>
          {members.map((member) => (
            <ListItem
              key={member.id}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Select
                    size="small"
                    value={member.role}
                    onChange={(e) => onUpdateRole(member.id, e.target.value)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => onRemoveMember(member.id)}
                    sx={{ ml: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar src={member.avatar} alt={member.name}>
                  {member.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.name} secondary={member.email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
