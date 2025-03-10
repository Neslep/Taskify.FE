import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Box,
  Paper,
  Button,
  Checkbox,
  Container,
  Typography,
  Link as MuiLink,
  FormControlLabel,
} from '@mui/material';

import { textGradient } from 'src/theme/styles';

import { QR_IMAGE_URL } from '../../../config';

export function PaymentView() {
  const location = useLocation();
  const navigate = useNavigate();

  // State để kiểm soát việc người dùng tick ô xác nhận
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Tiêu đề */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          sx={(theme) => ({
            ...textGradient(
              `to right, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.warning.main}`
            ),
          })}
        >
          Taskify Premium Membership Payment
        </Typography>

        {/* QR Code (thu nhỏ còn 75%) */}
        <Box
          component="img"
          src={QR_IMAGE_URL}
          alt="QR Code Thanh Toán"
          sx={{
            width: '85%',
            height: 'auto',
            mb: 2,
            display: 'block',
            mx: 'auto',
          }}
        />

        {/* Thông báo */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong style={{ color: 'red' }}>⚠︎ Important!: </strong>
            Please send your Payment Bill to{' '}
            <MuiLink
              href="https://www.facebook.com/taskifyvn"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontWeight: 'bold' }}
            >
              Taskify Fanpage
            </MuiLink>
          </Typography>
        </Box>

        {/* Ô checkbox xác nhận */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="caption">
              I confirm that I have made the payment and uploaded my bill to Fanpage.
            </Typography>
          }
        />

        {/* Nút xác nhận: chỉ hiển thị khi người dùng đã tick ô xác nhận */}
        <Button
          disabled={!isConfirmed}
          variant="contained"
          color="inherit"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/', { state: { from: location } })}
        >
          Payment Confirmation
        </Button>
      </Paper>
    </Container>
  );
}
