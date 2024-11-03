import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
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
  const dataFiltered = applyFilter({
    inputData: _mockProjects,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;
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
                rowCount={_mockProjects.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _mockProjects.map((project) => project.id)
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _mockProjects.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_mockProjects.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
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
