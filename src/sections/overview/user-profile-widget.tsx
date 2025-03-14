import type { CardProps } from '@mui/material/Card';

import React, { useContext } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Card, Avatar, Typography } from '@mui/material';

import { AuthContext } from 'src/contexts/AuthContext';
import { varAlpha, bgGradient } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';

import { Gender } from 'src/types/enum';

// ----------------------------------------------------------------------

export function UserProfileWidget({ sx, ...other }: CardProps) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const avatarSrc =
    user?.gender === Gender.Male
      ? 'assets/images/avatar/avatar-25.webp'
      : user?.gender === Gender.FeMale
        ? 'assets/images/avatar/avatar-1.webp'
        : 'assets/images/avatar/avatar-23.webp';

  // Chọn màu chủ đạo cho widget, có thể thay đổi tùy ý (ở đây chọn primary)
  const color: 'primary' | 'error' | 'secondary' | 'warning' = 'error';

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(
            theme.vars.palette[color].lightChannel,
            0.48
          )}`,
        }),
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={avatarSrc} alt={user?.userName} sx={{ width: 56, height: 56, mr: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user?.userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2">
          <strong>Phone:</strong> {user?.phoneNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Address:</strong> {user?.address}
        </Typography>
      </Box>
      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
