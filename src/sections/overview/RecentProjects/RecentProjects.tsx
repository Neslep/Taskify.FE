import type { CardProps } from '@mui/material/Card';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { useProjects } from 'src/hooks/project-data-hook';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

export default function RecentProjects({ title = 'Recent Projects', subheader, ...other }: Props) {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const { projects, loading } = useProjects();
  const recentProjects = projects.slice(0, 5);
  const navigate = useNavigate();

  const handleClick = (projectId: string) => {
    setActiveIndex(projectId === activeIndex ? null : projectId);
    navigate('/projects');
  };

  return (
    <Card
      {...other}
      sx={{
        mx: 'auto',
        borderRadius: 2,
        boxShadow: 3,
        minHeight: '100%',
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ pb: 0, borderBottom: 1, borderColor: 'divider' }}
      />

      <CardContent>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 3 }}>
            Loading...
          </Typography>
        ) : recentProjects.length > 0 ? (
          <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={2}>
            {recentProjects.map((project) => (
              <Box
                key={project.id}
                onClick={() => handleClick(project.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 1.5,
                  paddingRight: 1.5,
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: activeIndex === project.id ? 'primary.main' : 'background.paper',
                  color: activeIndex === project.id ? 'primary.contrastText' : 'text.primary',
                  boxShadow: activeIndex === project.id ? 3 : 0,
                  '&:hover': {
                    backgroundColor: activeIndex === project.id ? 'primary.dark' : 'grey.100',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography variant="body2">{project.projectName}</Typography>
                <IconButton color="inherit" size="small">
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 3 }}>
            No recent projects found.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
