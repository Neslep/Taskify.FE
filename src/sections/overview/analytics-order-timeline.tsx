import type { CardProps } from '@mui/material/Card';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';

import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import Avatar from '@mui/material/Avatar';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Pagination from '@mui/material/Pagination';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

// Import Scrollbar component (giả sử component này được tạo theo chuẩn của AnalyticsTasks)
import { Scrollbar } from 'src/components/scrollbar';

import { Gender } from '../../types/enum';
import { API_BASE_URL } from '../../../config';

type Member = {
  id: string;
  userName: string;
  gender: Gender | string;
  email: string;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: Member[];
};

export function AnalyticsUserMember({ title, subheader, ...other }: Props) {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const membersPerPage = 5;
  const [, setErrorSnackbar] = useState({ open: false, message: '' });
  const totalPages = Math.ceil(list.length / membersPerPage);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedList = list.slice((page - 1) * membersPerPage, page * membersPerPage);

  const fetchMember = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        setErrorSnackbar({ open: true, message: 'Token not found' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/projects/owned-project-members`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.isSuccess) {
        const membersData = result.data.$values.map((member: any) => ({
          id: member.id,
          userName: member.userName,
          gender: member.gender,
          email: member.email,
        }));
        console.log('Fetched members:', membersData);
        setList(membersData);
      }
    } catch (error) {
      setErrorSnackbar({ open: true, message: 'Error fetching user information' });
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  return (
    <Card
      {...other}
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader title={title} subheader={subheader} />

      {/* Sử dụng Scrollbar thay vì Box có overflow */}
      <Scrollbar sx={{ height: 250 }}>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        ) : list.length > 0 ? (
          <Timeline
            sx={{
              m: 0,
              p: 3,
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {paginatedList.map((member) => (
              <Item key={member.id} member={member} />
            ))}
          </Timeline>
        ) : (
          <Typography fontSize="12px" align="center" sx={{ mt: 2 }}>
            Empty List
          </Typography>
        )}
      </Scrollbar>

      {totalPages > 1 && (
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={totalPages} page={page} onChange={handleChange} />
        </Box>
      )}
    </Card>
  );
}

type ItemProps = TimelineItemProps & {
  member: Member;
};

function Item({ member, ...other }: ItemProps) {
  const avatarSrc =
    member.gender === Gender.Male
      ? 'assets/images/avatar/avatar-25.webp'
      : member.gender === Gender.FeMale
        ? 'assets/images/avatar/avatar-1.webp'
        : 'assets/images/avatar/avatar-23.webp';

  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={avatarSrc} alt={member.userName} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle2">{member.userName}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {member.email}
            </Typography>
          </Box>
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
}
