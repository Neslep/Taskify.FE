import React, { useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import { DialogContentText } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { useTable } from '../projectDetail/view';
import { API_BASE_URL } from '../../../../config';
import { TableEmptyRows } from '../table-empty-rows';
import { ProjectTableRow } from '../project-table-row';
import { ProjectTableHead } from '../project-table-head';
import { AuthContext } from '../../../contexts/AuthContext';
import { ProjectTableToolbar } from '../project-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { PlanType, ProjectRoles, ProjectStatus } from '../../../types/enum';

import type { ProjectType } from '../../../types/project';

export function ProjectView() {
  const table = useTable();
  const { user } = useContext(AuthContext);
  const [filterName, setFilterName] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });
  const [projects, setProjects] = useState<ProjectType[]>([]);




  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: ProjectStatus.NotStarted,
  });
  const [editProject, setEditProject] = useState<ProjectType | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.isSuccess) {
        const projectsData = result.data.$values.map((project: any) => ({
          ...project,
          userProjects: project.userProjects.$values,
          tasks: project.tasks.$values,
        }));
        setProjects(projectsData);
      }
    } catch (error) {
      setErrorSnackbar({ open: true, message: 'Error fetching user information' });
      setProjects([]);
    }
  }, []); // Chỉ chạy lại khi `user` thay đổi

  useEffect(() => {
    fetchProject();
  }, [fetchProject]); // Theo dõi sự thay đổi của projects

  // Cập nhật hàm handleCreateProject
  const handleCreateProject = async () => {
    setLoading(true);

    if (newProject.name.length < 3) {
      setErrorSnackbar({ open: true, message: 'Project name must be at least 3 characters long' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        setLoading(false);
        return;
      }

      if (user && user.plans === PlanType.Free && projects.length >= 1) {
        setErrorSnackbar({ open: true, message: 'Free plan users are limited to one project' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: newProject.name,
          description: newProject.description,
          projectStatus: newProject.status,
        }),
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to create project' });
        setLoading(false);
        return;
      }

      const createResult = await response.json();
      if (createResult.isSuccess) {
        await fetchProject();
        setNewProject({
          name: '',
          description: '',
          status: ProjectStatus.NotStarted,
        });
        handleCloseCreateDialog();
        setErrorSnackbar({ open: true, message: 'Project created successfully' });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorSnackbar({ open: true, message: 'Error creating project' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async () => {
    setLoading(true);

    if (!editProject) {
      setLoading(false);
      return;
    }

    if (editProject.projectName.length < 3) {
      setErrorSnackbar({ open: true, message: 'Project name must be at least 3 characters long' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects/${editProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editProject),
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to edit project' });
        setLoading(false);
        return;
      }

      const editResult = await response.json();
      if (editResult.isSuccess) {
        await fetchProject();
        setEditProject(null);
        handleCloseEditDialog();
        setErrorSnackbar({ open: true, message: 'Project edited successfully' });
      }
    } catch (error) {
      console.error('Error editing project:', error);
      setErrorSnackbar({ open: true, message: 'Error editing project' });
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setOpenDeleteDialog(true);
  };
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects/${projectToDelete}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to delete project' });
        return;
      }

      const result = await response.json();
      if (result.isSuccess) {
        await fetchProject(); // Fetch updated data after successful deletion
        setErrorSnackbar({ open: true, message: 'Project deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setErrorSnackbar({ open: true, message: 'Error deleting project' });
    } finally {
      setOpenDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenEditDialog = (project: ProjectType) => {
    const currentUserProject = project.userProjects.find(
      (userProject) => userProject.userId === user?.id
    );
    if (currentUserProject?.roleInProject === ProjectRoles.Owner) {
      setEditProject(project);
      setOpenEditDialog(true);
    } else {
      setErrorSnackbar({ open: true, message: 'Only the owner can edit the project' });
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditProject(null);
  };

  const handleCloseSnackbar = () => {
    setErrorSnackbar({ open: false, message: '' });
  };

  const dataFiltered = applyFilter({
    inputData: projects.map((project) => ({
      ...project,
      name: project.projectName,
      status: project.projectStatus as unknown as ProjectStatus,
    })),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Projects
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenCreateDialog}
        >
          New Project
        </Button>
      </Box>

      <Card>
        <ProjectTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProjectTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={projects.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    projects.map((project) => project.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ProjectTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleOpenEditDialog(row as unknown as ProjectType)}
                      onDeleteRow={() => handleDeleteProject(row.id)} />
                  ))}
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, projects.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={projects.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={newProject.status}
              onChange={(e) =>
                setNewProject({ ...newProject, status: e.target.value as ProjectStatus })
              }
              variant="outlined"
            >
              <MenuItem value={ProjectStatus.NotStarted}>Not Started</MenuItem>
              <MenuItem value={ProjectStatus.InProgress}>In Progress</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCreateProject} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleCloseCreateDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={editProject?.projectName || ''}
            onChange={(e) =>
              setEditProject((prev) => prev && { ...prev, projectName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editProject?.description || ''}
            onChange={(e) =>
              setEditProject((prev) => prev && { ...prev, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={editProject?.projectStatus || ''}
              onChange={(e) =>
                setEditProject(
                  (prev) =>
                    prev && { ...prev, projectStatus: e.target.value as ProjectStatus }
                )
              }
              variant="outlined"
            >
              <MenuItem value={ProjectStatus.NotStarted}>Not Started</MenuItem>
              <MenuItem value={ProjectStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={ProjectStatus.Completed}>Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleEditProject} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleCloseEditDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDeleteProject} variant="contained" color="error" autoFocus>
            Delete
          </Button>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>



      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
