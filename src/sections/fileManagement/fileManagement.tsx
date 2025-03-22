import type { Table as DexieTable } from 'dexie';

import Dexie from 'dexie';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';
import DriveFolderUploadTwoToneIcon from '@mui/icons-material/DriveFolderUploadTwoTone';
import {
  Box,
  Menu,
  Paper,
  Alert,
  Button,
  Dialog,
  MenuItem,
  TableRow,
  Checkbox,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
  Table as MUITable,
} from '@mui/material';

interface StoredFile {
  id?: number; // Auto-increment ID
  name: string; // Tên file
  type: string; // MIME type (có thể chưa chính xác)
  size: number; // Kích thước (bytes)
  lastModified: number; // Thời điểm lastModified
  data: Blob; // Nội dung file (Blob)
}

class FileDB extends Dexie {
  files!: DexieTable<StoredFile, number>;

  constructor() {
    super('FileDB');
    this.version(1).stores({
      files: '++id, name, type, size, lastModified',
    });
  }
}

const db = new FileDB();

const HiddenInput = styled('input')({
  display: 'none',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.action.hover,
  },
}));

function getFriendlyFileType(file: StoredFile) {
  // Lấy extension từ tên file (nếu có)
  const ext = file.name.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return 'PDF Document';
    case 'doc':
    case 'docx':
      return 'Word Document';
    case 'xls':
    case 'xlsx':
      return 'Excel Spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'PowerPoint Presentation';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'Image';
    case 'mp4':
    case 'mov':
      return 'Video';
    case 'zip':
    case 'rar':
      return 'Archive';
    default:
      return ext ? `${ext.toUpperCase()} File` : 'Unknown';
  }
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getIcon(type: string) {
  if (type.toLowerCase().includes('folder')) {
    return <FolderTwoToneIcon style={{ marginRight: 8 }} />;
  }
  return <InsertDriveFileTwoToneIcon style={{ marginRight: 8 }} />;
}

export default function FileManagement() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState<number | null>(null);
  const [renameFileNewName, setRenameFileNewName] = useState('');

  // Menu state (3 chấm)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState<number | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');

  // Preview Dialog state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');

  // Hàm hiển thị Snackbar
  const showSnackbar = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const allFiles = await db.files.toArray();
    setFiles(allFiles);
  }

  // ---------------------- Upload file ----------------------
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const fileArray = Array.from(event.target.files);
    await Promise.all(
      fileArray.map((file) => {
        const newFile: StoredFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: file,
        };
        return db.files.add(newFile);
      })
    );
    await fetchFiles();
    event.target.value = '';
    showSnackbar('Files uploaded successfully!', 'success');
  };

  // ---------------------- Chọn file ----------------------
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = files.map((f) => f.id!).filter(Boolean);
      setSelectedFiles(allIds);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>, fileId: number) => {
    if (event.target.checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };

  // ---------------------- Tải file ----------------------
  const handleDownload = (file: StoredFile) => {
    const url = URL.createObjectURL(file.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    handleCloseMenu();
    showSnackbar('Download started!', 'info');
  };

  // ---------------------- Preview file ----------------------
  const handlePreview = (file: StoredFile) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file.data);
      setPreviewImageUrl(url);
      setPreviewFileName(file.name);
      setPreviewDialogOpen(true);
    } else {
      showSnackbar('Preview not available for this file type.', 'warning');
    }
    handleCloseMenu();
  };

  // ---------------------- Rename file ----------------------
  const handleOpenRename = (fileId: number, fileName: string) => {
    setRenameFileId(fileId);
    setRenameFileNewName(fileName);
    setRenameDialogOpen(true);
    handleCloseMenu();
  };

  const handleRenameSave = async () => {
    if (renameFileId !== null) {
      await db.files.update(renameFileId, { name: renameFileNewName });
      await fetchFiles();
      showSnackbar('File renamed successfully!', 'success');
    }
    setRenameDialogOpen(false);
  };

  // ---------------------- Delete file ----------------------
  const handleDeleteFile = async (fileId: number) => {
    await db.files.delete(fileId);
    await fetchFiles();
    handleCloseMenu();
    showSnackbar('File deleted successfully!', 'success');
  };

  // ---------------------- Pagination ----------------------
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ---------------------- Filter & Paginate ----------------------
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedFiles = filteredFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ---------------------- Menu (3 chấm) ----------------------
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, fileId: number) => {
    setMenuAnchor(event.currentTarget);
    setMenuFileId(fileId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuFileId(null);
  };

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
        <Button
          variant="contained"
          color="inherit"
          component="label"
          startIcon={<DriveFolderUploadTwoToneIcon />}
        >
          Upload
          <HiddenInput type="file" multiple onChange={handleFileChange} />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <MUITable>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
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
              <TableCell align="center" sx={{ width: 50 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFiles.map((file) => (
              <StyledTableRow key={file.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFiles.includes(file.id!)}
                    onChange={(event) => handleSelectFile(event, file.id!)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getIcon(file.type)}
                    {file.name}
                  </Box>
                </TableCell>
                <TableCell>{formatSize(file.size)}</TableCell>
                <TableCell>{getFriendlyFileType(file)}</TableCell>
                <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, file.id!)}
                    size="small"
                    aria-label="more"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </MUITable>
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

      {/* Menu 3 chấm */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menuFileId && (
          <>
            <MenuItem
              onClick={() => {
                const f = files.find((file) => file.id === menuFileId);
                if (f) handleDownload(f);
              }}
            >
              Download
            </MenuItem>
            <MenuItem
              onClick={() => {
                const f = files.find((file) => file.id === menuFileId);
                if (f) handlePreview(f);
              }}
            >
              Preview
            </MenuItem>
            <MenuItem
              onClick={() => {
                const f = files.find((file) => file.id === menuFileId);
                if (f) handleOpenRename(f.id!, f.name);
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeleteFile(menuFileId);
              }}
              sx={{ color: 'error.main' }}
            >
              Delete
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            label="New Name"
            fullWidth
            value={renameFileNewName}
            onChange={(e) => setRenameFileNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl('');
        }}
        maxWidth="md"
      >
        <DialogTitle>{previewFileName}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={previewImageUrl}
              alt={previewFileName}
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPreviewDialogOpen(false);
              URL.revokeObjectURL(previewImageUrl);
              setPreviewImageUrl('');
            }}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
