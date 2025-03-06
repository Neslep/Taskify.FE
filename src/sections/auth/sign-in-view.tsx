import React, { useState, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { AuthContext } from 'src/contexts/AuthContext';

import { Iconify } from 'src/components/iconify';

import { API_BASE_URL } from '../../../config';

export function SignInView() {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State cho validate của từng trường
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State cho snackbar thông báo lỗi khi đăng nhập sai
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Validate các trường trước khi gửi request
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
      if (!valid) {
        return;
      }

      const minDelay = 2000; // 2 giây
      const startTime = Date.now();

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login Failed! Email or password incorrect!');
        }

        const result = await response.json();
        if (!result.isSuccess) {
          throw new Error(result.message || 'Login failed');
        }

        // Lưu token vào localStorage
        localStorage.setItem('jwttoken', result.data);
        sessionStorage.setItem('email', email);

        // Báo cho AuthContext biết là đã login
        setIsAuthenticated(true);

        router.push('/');
      } catch (error: any) {
        setErrorMessage(error.message || 'Error occurs!');
        setOpenSnackbar(true);
      } finally {
        // Tính toán thời gian đã trôi qua và đảm bảo loading kéo dài tối thiểu minDelay
        const elapsed = Date.now() - startTime;
        const remainingDelay = minDelay - elapsed;
        if (remainingDelay > 0) {
          setTimeout(() => {
            setLoading(false);
          }, remainingDelay);
        } else {
          setLoading(false);
        }
      }
    },
    [email, password, router, setIsAuthenticated]
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
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
              if (e.target.value.trim()) {
                setEmailError('');
              }
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
          />

          <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
            Forgot password?
          </Link>

          <TextField
            fullWidth
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim()) {
                setPasswordError('');
              }
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
    </>
  );
}
