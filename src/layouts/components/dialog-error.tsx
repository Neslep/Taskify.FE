import React from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface ErrorDialogProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, message, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
        sx={{
            '& .MuiDialog-paper': {
                padding: 2,
                borderRadius: 2,
                boxShadow: 6,
                border: '2px solid #d32f2f',
                background: 'linear-gradient(135deg, #ffe9e8, #fef5e7)',
                transform: open ? 'scale(1)' : 'scale(0.9)',
                transition: 'transform 0.3s ease-in-out',
                minWidth: 300,
            },
        }}
    >
        <DialogTitle
            sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                padding: '12px 16px',
                position: 'relative',
            }}
        >
            Error
            <Box
                component="span"
                sx={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    '&:hover': { color: '#ffcccc' },
                }}
                onClick={onClose}
            >
                ✖
            </Box>
        </DialogTitle>
        <DialogContent
            sx={{
                textAlign: 'center',
                color: '#333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#fce4ec',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#d32f2f',
                    }}
                >
                    ✖
                </Typography>
            </Box>

            {/* Message */}
            <Typography variant="body1" sx={{ fontSize: '0.95rem', color: '#555' }}>
                {message}
            </Typography>
        </DialogContent>
        <DialogActions
            sx={{
                justifyContent: 'center',
                padding: '8px 16px',
            }}
        >
            <Button
                variant="contained"
                onClick={onClose}
                sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '6px 24px',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                    '&:hover': {
                        backgroundColor: '#b71c1c',
                    },
                }}
            >
                OK
            </Button>
        </DialogActions>
    </Dialog>
);

export default ErrorDialog;