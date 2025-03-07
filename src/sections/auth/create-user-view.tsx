import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { API_BASE_URL } from '../../../config';

// ----------------------------------------------------------------------

export function CreateUserView() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');

  const [loading, setLoading] = useState(false);

  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [genderError, setGenderError] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleSignUp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      let valid = true;
      if (!userName.trim()) {
        setUserNameError('Please input your User Name!');
        valid = false;
      } else {
        setUserNameError('');
      }
      if (!email.trim()) {
        setEmailError('Please input your Email!');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Please input a valid Email!');
        valid = false;
      } else {
        setEmailError('');
      }
      if (!passwordHash.trim()) {
        setPasswordError('Please input your Password!');
        valid = false;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordHash)) {
        setPasswordError(
          'Password must be at least 8 characters long, with uppercase, lowercase letters and a number!'
        );
        valid = false;
      } else {
        setPasswordError('');
      }
      if (gender === '') {
        setGenderError('Please select your Gender!');
        valid = false;
      } else {
        setGenderError('');
      }

      if (!valid) {
        return;
      }

      const minDelay = 2000;
      const startTime = Date.now();
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName,
            email,
            passwordHash,
            phoneNumber,
            address,
            gender: Number(gender),
            status: 0,
            plans: 0,
            avatarPath: '',
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.isSuccess) {
          setEmailError(result.message);
          throw new Error(result.message || 'Sign up failed!');
        }

        router.push('/sign-in');
      } catch (error: any) {
        setErrorMessage(error.message || 'Error occurs!');
        setOpenSnackbar(true);
      } finally {
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
    [userName, email, passwordHash, phoneNumber, address, gender, router]
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Create an Account</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link href="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      <form onSubmit={handleSignUp}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <TextField
            fullWidth
            name="userName"
            label="User Name"
            inputProps={{ maxLength: 50 }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (e.target.value.trim()) setUserNameError('');
            }}
            error={!!userNameError}
            helperText={userNameError}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email address"
            inputProps={{ maxLength: 50 }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim()) setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={passwordHash}
            onChange={(e) => {
              setPasswordHash(e.target.value);
              if (e.target.value.trim()) setPasswordError('');
            }}
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

          <TextField
            fullWidth
            name="phoneNumber"
            label="Phone Number (optional)"
            value={phoneNumber}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              if (numericValue.length <= 11) {
                setPhoneNumber(numericValue);
                if (numericValue.trim()) setPhoneNumberError('');
              }
            }}
            error={!!phoneNumberError}
            helperText={phoneNumberError}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="address"
            label="Address (optional)"
            inputProps={{ maxLength: 255 }}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (e.target.value.trim()) setAddressError('');
            }}
            error={!!addressError}
            helperText={addressError}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }} error={!!genderError}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              label="Gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                if (e.target.value !== '') setGenderError('');
              }}
            >
              <MenuItem value={0}>Male</MenuItem>
              <MenuItem value={1}>Female</MenuItem>
              <MenuItem value={2}>Other</MenuItem>
            </Select>
            {genderError && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {genderError}
              </Typography>
            )}
          </FormControl>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
            loading={loading}
            disabled={loading}
          >
            Sign up
          </LoadingButton>
        </Box>
      </form>

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
