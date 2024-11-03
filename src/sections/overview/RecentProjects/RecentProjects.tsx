import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

const projectList = [
  { id: '1', name: 'Twitter App' },
  { id: '2', name: 'Web Application Development' },
  { id: '3', name: 'City Advertising Campaign' },
  { id: '4', name: 'Facebook Application' },
];

export default function RecentProjects() {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  const handleClick = (projectId: string) => {
    setActiveIndex(projectId === activeIndex ? null : projectId);
  };

  return (
    <Card sx={{ width: 560, mx: 'auto', p: 2 }}>
      <CardHeader title="Recent Projects" />

      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ mt: 2 }}>
        {projectList.map((project) => (
          <Box
            key={project.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              backgroundColor: activeIndex === project.id ? '#28cc38' : '#f7f8fa',
              color: activeIndex === project.id ? 'white' : 'inherit',
              borderRadius: 1,
              transition: 'background-color 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => handleClick(project.id)}
          >
            <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {project.name}
            </Typography>
            <IconButton color="inherit" size="small">
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
