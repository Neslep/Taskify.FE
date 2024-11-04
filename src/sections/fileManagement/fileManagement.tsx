/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import { styled } from '@mui/system';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';
import DriveFolderUploadTwoToneIcon from '@mui/icons-material/DriveFolderUploadTwoTone';
import {
  Box,
  Table,
  Paper,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { mockFiles } from './mockFiles';

const Input = styled('input')({
  display: 'none',
});

// Define a styled table row with hover effect
const StyledTableRow = styled(TableRow)({
  transition: 'box-shadow 0.3s ease',
  borderRadius: '10px',
  '&:hover': {
    boxShadow: '4px 4px 4px 4px rgba(0, 0, 0, 0.2)',
  },
});

function FileManagement() {
  const [files, setFiles] = useState<typeof mockFiles>(mockFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([
        ...files,
        ...Array.from(event.target.files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          shared: 'No',
        })),
      ]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedFiles(files.map((file) => file.name));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
    if (event.target.checked) {
      setSelectedFiles([...selectedFiles, fileName]);
    } else {
      setSelectedFiles(selectedFiles.filter((name) => name !== fileName));
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getIcon = (type: string) => {
    if (type.toLowerCase() === 'folder') {
      return <FolderTwoToneIcon style={{ marginRight: 8 }} />;
    }
    return <InsertDriveFileTwoToneIcon style={{ marginRight: 8 }} />;
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedFiles = filteredFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        File Management
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label htmlFor="upload-file" id="upload-file-label">
          <Input id="upload-file" type="file" multiple onChange={handleFileChange} />
          <Button
            variant="contained"
            color="inherit"
            component="span"
            startIcon={<DriveFolderUploadTwoToneIcon />}
          >
            Upload
          </Button>
        </label>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={selectedFiles.length > 0 && selectedFiles.length < files.length}
                  checked={files.length > 0 && selectedFiles.length === files.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Shared</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFiles.map((file, index) => (
              <StyledTableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.name)}
                    onChange={(event) => handleSelectFile(event, file.name)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getIcon(file.type)} {file.name}
                  </Box>
                </TableCell>
                <TableCell>{formatSize(file.size)}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                <TableCell>{file.shared}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredFiles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default FileManagement;
