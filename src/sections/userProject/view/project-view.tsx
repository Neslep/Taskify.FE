import React, { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { ProjectTableRow } from '../project-table-row';
import { ProjectTableHead } from '../project-table-head';
import { ProjectTableToolbar } from '../project-table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import { useTable } from '../projectDetail/view';
import { API_BASE_URL } from '../../../../config';
import {ProjectType} from '../../../types/project';
import {PlanType, ProjectRoles, ProjectStatus} from '../../../types/enum';
import { AuthContext } from '../../../contexts/AuthContext';

export function ProjectView() {
  const table = useTable();
  const { user } = useContext(AuthContext);
  const [filterName, setFilterName] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: ProjectStatus.NotStarted,
    memberName: '',
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

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Get information failed' });
        return;
      }

      const result = await response.json();
      if (result.isSuccess) {
        const projectsData = result.data.$values.map((project: any) => ({
          ...project,
          userProjects: project.userProjects.$values,
          tasks: project.tasks.$values,
          kanbans: project.kanbans.$values,
          todolists: project.todolists.$values,
        }));
        setProjects(projectsData);
      }
    } catch (error) {
      setErrorSnackbar({ open: true, message: 'Error fetching user information' });
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      if (user && user.plans === PlanType.Free && projects.length >= 1) {
        setErrorSnackbar({ open: true, message: 'Free plan users are limited project creation' });
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
          memberName: newProject.memberName,
        }),
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to create project' });
        return;
      }

      const result = await response.json();
      if (result.isSuccess) {
        setProjects([...projects, result.data]);
        setNewProject({
          name: '',
          description: '',
          status: ProjectStatus.NotStarted,
          memberName: '',
        });
        handleCloseCreateDialog();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorSnackbar({ open: true, message: 'Error creating project' });
    }
  };

  const handleEditProject = async () => {
    if (!editProject) return;

    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
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
        return;
      }

      const result = await response.json();
      if (result.isSuccess) {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === editProject.id ? result.data : project
            )
        );
        setEditProject(null);
        handleCloseEditDialog();
      }
    } catch (error) {
      console.error('Error editing project:', error);
      setErrorSnackbar({ open: true, message: 'Error editing project' });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects/${projectId}`, {
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
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
        setErrorSnackbar({ open: true, message: 'Project deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setErrorSnackbar({ open: true, message: 'Error deleting project' });
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
                              onDeleteRow={() => handleDeleteProject(row.id)} // Add this line
                          />
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
            <TextField
                margin="dense"
                label="Member Name"
                fullWidth
                value={newProject.memberName}
                onChange={(e) => setNewProject({ ...newProject, memberName: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCreateProject}>
              Create
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
                      setEditProject((prev) => prev && { ...prev, projectStatus: e.target.value as unknown as ProjectStatus })
                  }
                  variant="outlined"
              >
                <MenuItem value={ProjectStatus.NotStarted}>Not Started</MenuItem>
                <MenuItem value={ProjectStatus.InProgress}>In Progress</MenuItem>
                <MenuItem value={ProjectStatus.Completed}>Completed</MenuItem>
                <MenuItem value={ProjectStatus.InReview}>In Review</MenuItem>
                <MenuItem value={ProjectStatus.Ongoing}>Ongoing</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleEditProject}>
              Save
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleCloseEditDialog}>
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