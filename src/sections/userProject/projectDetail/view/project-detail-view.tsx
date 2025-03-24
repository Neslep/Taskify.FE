import { parse } from 'date-fns';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { API_BASE_URL } from '../../../../../config';
import { ProjectTableRow } from '../project-table-row';
import { ProjectTableHead } from '../project-table-head';
import { ProjectTableToolbar } from '../project-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { TaskStatus, PriorityLevel } from '../../../../types/enum';

import type { TaskType, UserType, TaskProps } from '../../../../types/project';

// ----------------------------------------------------------------------

export function ProjectDetailView() {
  const table = useTable();
  const location = useLocation();
  const project = location.state?.project;
  const [filterName, setFilterName] = useState('');
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editTask, setEditTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    taskName: '',
    assigneeEmail: '',
    dueDate: new Date(),
    taskStatus: TaskStatus.ToDo,
    priority: PriorityLevel.Low,
  });

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/tasks/${project.id}/tasks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });



      const result = await response.json();
      console.log(result.data);
      if (result.isSuccess && Array.isArray(result.data)) {
        const tasksData: TaskProps[] = result.data.map((task: any) => ({
          ...task,
          assignee: task.assignedUser
            ? [
                {
                  userName: task.assignedUser.userName,
                  userId: task.assignedUser.id,
                  gender: task.assignedUser.gender,
                },
              ]
            : [{ userName: 'Unassigned', userId: '', gender: '' }],
          dueDate: new Date(task.dueDate).toLocaleString(),
          priority: task.priority as PriorityLevel,
          status: task.status as TaskStatus,

        }));
        setTasks(tasksData);
      } else {
        console.error('API Error or Invalid Data:', result.message);
      }
    } catch (error) {
      setErrorSnackbar({ open: true, message: 'Error fetching user information' });
      setTasks([]);
    }
  }, [project.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const handleCreateTask = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      // thêm giúp tôi các case lỗi
      if (!newTask.taskName) {
        setErrorSnackbar({ open: true, message: 'Task name is required' });
        console.log(errorSnackbar);
        setLoading(false);
        return;
      }
      if (!newTask.assigneeEmail) {
        setErrorSnackbar({ open: true, message: 'Assignee email is required' });
        setLoading(false);
        return;
      }
      if (!newTask.dueDate) {
        setErrorSnackbar({ open: true, message: 'Due date is required' });
        setLoading(false);
        return;
      }

      if (newTask.taskName.length < 3) {
        setErrorSnackbar({ open: true, message: 'Task name must be at least 3 characters' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/tasks/${project.id}/tasks`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName: newTask.taskName,
          assignedEmail: newTask.assigneeEmail,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          status: newTask.taskStatus,
        }),
      });

      const result = await response.json();

      if (result.isSuccess) {
        setNewTask({
          taskName: '',
          assigneeEmail: '',
          dueDate: new Date(),
          taskStatus: TaskStatus.ToDo,
          priority: PriorityLevel.Low,
        });
        fetchTasks();
        setOpenCreateDialog(false);
      } else {
        console.error('API Error or Invalid Data:', result.message);
      }
    } catch (error) {
      setErrorSnackbar({ open: true, message: 'Error creating task' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    setLoading(true);

    if (!editTask) {
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

      const response = await fetch(`${API_BASE_URL}api/tasks/${project.id}/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editTask),
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to edit task' });
        setLoading(false);
        return;
      }

      const editResult = await response.json();
      if (editResult.isSuccess) {
        await fetchTasks();
        setEditTask(null);
        handleCloseEditDialog();
        setErrorSnackbar({ open: true, message: 'Task edited successfully' });
      }
    } catch (error) {
      console.error('Error editing task:', error);
      setErrorSnackbar({ open: true, message: 'Error editing task' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteProject = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/tasks/${project.id}/tasks/${taskToDelete}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setErrorSnackbar({ open: true, message: 'Failed to delete task' });
        return;
      }

      const result = await response.json();
      if (result.isSuccess) {
        await fetchTasks(); // Fetch updated data after successful deletion
        setErrorSnackbar({ open: true, message: 'Task deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrorSnackbar({ open: true, message: 'Error deleting task' });
    } finally {
      setOpenDeleteDialog(false);
      setTaskToDelete(null);
    }
  };

  const handleOpenEditDialog = (task: TaskType) => {
    const dueDate = task.dueDate;

    // Gán task với dueDate đã được kiểm tra hoặc chuyển đổi thành Date hợp lệ
    setEditTask({
      ...task,
      dueDate: !Number.isNaN(dueDate.getTime()) ? dueDate : new Date(), // Nếu không hợp lệ, gán ngày hiện tại
    });

    console.log(task);
    setOpenEditDialog(true);
  };

  const dataFiltered = applyFilter({
    inputData: tasks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !tasks.length && !!filterName;

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditTask(null);
  };

  const handleCloseSnackbar = () => {
    setErrorSnackbar({ open: false, message: '' });
  };

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h4" flexGrow={1}>
            {project?.projectName || 'Project Name'}
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreateDialog}
          >
            New Task
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {project?.description || 'Project Description'}
        </Typography>
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
          <TableContainer
            sx={{
              overflow: 'unset',
            }}
          >
            <Table
              sx={{
                minWidth: 800,
              }}
            >
              <ProjectTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={tasks.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tasks.map((task) => task.id)
                  )
                }
                headLabel={[
                  {
                    id: 'taskName',
                    label: 'Task Name',
                  },
                  {
                    id: 'assignee',
                    label: 'Assignee',
                  },
                  {
                    id: 'dueDate',
                    label: 'Due Date',
                  },
                  {
                    id: 'priority',
                    label: 'Priority',
                  },
                  {
                    id: 'status',
                    label: 'Status',
                  },
                  {
                    id: '', // For actions column
                  },
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
                      onDeleteRow={() => handleDeleteTask(row.id)}
                      onEditRow={() =>
                        handleOpenEditDialog({
                          ...row,
                          assignedUser: row.assignee[0].userName as unknown as UserType,
                          assignedUserId: parseInt(row.assignee[0].userId, 10),
                          dueDate: new Date(row.dueDate),
                        })
                      }
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tasks.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={tasks.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            value={newTask.taskName}
            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Assignee"
            fullWidth
            value={newTask.assigneeEmail}
            onChange={(e) => setNewTask({ ...newTask, assigneeEmail: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date (DD/MM/YYYY hh:mm)"
            fullWidth
            value={newTask.dueDate.toLocaleString()}
            onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
            inputProps={{ pattern: '\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value as PriorityLevel })
              }
              variant="outlined"
            >
              <MenuItem value={PriorityLevel.Low}>Low</MenuItem>
              <MenuItem value={PriorityLevel.Medium}>Medium</MenuItem>
              <MenuItem value={PriorityLevel.High}>High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={newTask.taskStatus}
              onChange={(e) => setNewTask({ ...newTask, taskStatus: e.target.value as TaskStatus })}
              variant="outlined"
            >
              <MenuItem value={TaskStatus.ToDo}>Not Started</MenuItem>
              <MenuItem value={TaskStatus.InProgress}>InProgress</MenuItem>
              <MenuItem value={TaskStatus.Done}>Done</MenuItem>
              <MenuItem value={TaskStatus.Cancelled}>Cancelled</MenuItem>
              <MenuItem value={TaskStatus.Pending}>Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCreateTask} disabled={loading}>
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
            margin="dense"
            label="Due Date (DD/MM/YYYY hh:mm)"
            fullWidth
            value={editTask?.dueDate.toLocaleString() || ''}
            onChange={(e) => {
              const parsedDate = parse(e.target.value, 'dd/MM/yyyy HH:mm', new Date());
              setEditTask((prev) => prev && { ...prev, dueDate: parsedDate });
            }}
            inputProps={{ pattern: '\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={editTask?.priority || ''}
              onChange={(e) =>
                setEditTask((prev) => prev && { ...prev, priority: e.target.value as PriorityLevel })
              }
              variant="outlined"
            >
              <MenuItem value={PriorityLevel.Low}>Low</MenuItem>
              <MenuItem value={PriorityLevel.Medium}>Medium</MenuItem>
              <MenuItem value={PriorityLevel.High}>High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={editTask?.status || ''}
              onChange={(e) =>
                setEditTask((prev) => prev && { ...prev, status: e.target.value as TaskStatus })
              }
              variant="outlined"
            >
              <MenuItem value={TaskStatus.ToDo}>ToDo</MenuItem>
              <MenuItem value={TaskStatus.InProgress}>InProgress</MenuItem>
              <MenuItem value={TaskStatus.Done}>Done</MenuItem>
              <MenuItem value={TaskStatus.Cancelled}>Cancelled</MenuItem>
              <MenuItem value={TaskStatus.Pending}>Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleEditTask} disabled={loading}>
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
            Are you sure you want to delete this task?
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
} // ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );
  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }

    setSelected([]);
  }, []);
  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];
      setSelected(newSelected);
    },
    [selected]
  );
  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);
  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );
  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
