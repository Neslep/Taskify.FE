import React, { useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { AuthContext } from 'src/contexts/AuthContext';

import { Iconify } from 'src/components/iconify';

import { API_BASE_URL } from '../../../config';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      let valid = true;
      if (!email.trim()) {
        setEmailError('Please input your Email!');
        valid = false;
      } else {
        setEmailError('');
      }
      if (!password.trim()) {
        setPasswordError('Please input your Password!');
        valid = false;
      } else {
        setPasswordError('');
      }
      if (!valid) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (!response.ok || !result.isSuccess) {
          setEmailError('Email or password incorrect!');
          setPasswordError('Email or password incorrect!');
          setLoading(false);
          throw new Error(result.message || 'Login failed');
        }

        sessionStorage.setItem('email', email);

        await login(result.data);
      } catch (error: any) {
        setErrorMessage(error.message || 'Error occurs!');
        setOpenSnackbar(true);
      }
    },
    [email, password, login]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in to Taskify</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link href="/sign-up" variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign up
          </Link>
        </Typography>
      </Box>

      <form onSubmit={handleSignIn}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <TextField
            fullWidth
            name="email"
            label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim()) setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
          />

          {/* Khi nhấp vào đây sẽ mở dialog Forgot Password */}
          <Link
            variant="body2"
            color="inherit"
            sx={{ mb: 1.5, cursor: 'pointer' }}
            onClick={() => setOpenDialog(true)}
          >
            Forgot password?
          </Link>

          <TextField
            fullWidth
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim()) setPasswordError('');
            }}
            type={showPassword ? 'text' : 'password'}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
            loading={loading}
            disabled={loading}
          >
            Sign in
          </LoadingButton>
        </Box>
      </form>

      {/* Snackbar hiển thị lỗi đăng nhập */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Dialog Forgot Password */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Please contact Admin to support for password change!
          </Typography>
          <Link href="https://www.facebook.com/taskifyvn" target="_blank" rel="noopener">
            👉 Contact admin via Facebook
          </Link>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
