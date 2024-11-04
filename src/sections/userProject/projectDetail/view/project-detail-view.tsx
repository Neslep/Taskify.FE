import { useState, useCallback } from 'react';

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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { _mockProjects } from 'src/_mock/_mockProjectDetail';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { ProjectTableRow } from '../project-table-row';
import { ProjectTableHead } from '../project-table-head';
import { ProjectTableToolbar } from '../project-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export function ProjectDetailView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [tasks, setTasks] = useState(_mockProjects);
  const dataFiltered = applyFilter({
    inputData: tasks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: '',
    assignee: { name: '', avatar: '' },
    dueDate: '',
    priority: 'Low',
    status: '',
    progress: 0,
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateTask = () => {
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: (1 + tasks.length).toString(),
        priority: newTask.priority as 'High' | 'Medium' | 'Low',
        status: newTask.status as 'In Progress' | 'Completed' | 'Pending',
        progress: Number(newTask.progress),
      },
    ]);
    setNewTask({
      taskName: '',
      assignee: { name: '', avatar: '' },
      dueDate: '',
      priority: '',
      status: '',
      progress: 0,
    });
    handleCloseDialog();
  };

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h4" flexGrow={1}>
            EXE101 - FPTU QN
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenDialog}
          >
            New Task
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Dự án khởi nghiệp của Group 4
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
                    tasks.map((project) => project.id)
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
                    id: 'progress',
                    label: 'Progress',
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
            value={newTask.assignee.name}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: { ...newTask.assignee, name: e.target.value } })
            }
          />
          <TextField
            margin="dense"
            label="Due Date (DD/MM/YYYY hh:mm)"
            fullWidth
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            inputProps={{ pattern: '\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              variant="outlined"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              variant="outlined"
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="InProgress">InProgress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCreateTask}>
            Create
          </Button>
          <Button variant="outlined" color='inherit' onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
