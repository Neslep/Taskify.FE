import { keyframes } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import TaskIcon from '@mui/icons-material/Task';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { useProjects } from 'src/hooks/project-data-hook';
import { useMemberData } from 'src/hooks/project-member-hook';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsTasks } from '../analytics-tasks';
import { UserProfileWidget } from '../user-profile-widget';
import RecentProjects from '../RecentProjects/RecentProjects';
import { AnalyticsUserMember } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

const rippleAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
`;

const widgetHoverStyle = {
  position: 'relative', // cần thiết để định vị pseudo-element
  overflow: 'hidden', // ẩn phần pseudo-element tràn ra ngoài
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05) rotateX(3deg) rotateY(3deg)', // tạo hiệu ứng 3D nhẹ
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)', // đổ bóng mạnh hơn
  },

  '&:active::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    animation: `${rippleAnimation} 0.6s ease-out`,
  },
};

export function OverviewAnalyticsView() {
  const { projects } = useProjects();
  const { members } = useMemberData();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back👋
      </Typography>

      <Grid container spacing={3}>
        {/* ====== 4 WIDGET TÓM TẮT ====== */}
        <Grid xs={12} sm={6} md={3}>
          <UserProfileWidget sx={widgetHoverStyle} />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Projects"
            percent={projects.length}
            total={projects.length}
            icon={<AssignmentIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
            sx={widgetHoverStyle}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tasks"
            percent={projects.length}
            total={projects.length}
            color="secondary"
            icon={<TaskIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
            sx={widgetHoverStyle}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Members"
            percent={members.length}
            total={members.length}
            color="warning"
            icon={<PeopleIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
            sx={widgetHoverStyle}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Revenue"
            percent={0}
            total={1000}
            color="error"
            icon={<AttachMoneyIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
            sx={widgetHoverStyle}
          />
        </Grid> */}

        {/* ====== 3 COMPONENT CHÍNH BÊN DƯỚI ====== */}
        <Grid xs={12} md={4}>
          <RecentProjects title="Recent Projects" />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsUserMember title="User Member" list={[]} />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsTasks title="Tasks" />
        </Grid>
      </Grid>

      {/* 
      ==============================
      =    CODE DEMO ĐANG COMMENT  =
      ==============================
      <Grid xs={12} md={6} lg={4}>
        <AnalyticsCurrentVisits
          title="Current visits"
          chart={{
            series: [
              { label: 'America', value: 3500 },
              { label: 'Asia', value: 2500 },
              { label: 'Europe', value: 1500 },
              { label: 'Africa', value: 500 },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={8}>
        <AnalyticsWebsiteVisits
          title="Website visits"
          subheader="(+43%) than last year"
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            series: [
              { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
              { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={8}>
        <AnalyticsConversionRates
          title="Conversion rates"
          subheader="(+43%) than last year"
          chart={{
            categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
            series: [
              { name: '2022', data: [44, 55, 41, 64, 22] },
              { name: '2023', data: [53, 32, 33, 52, 13] },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AnalyticsCurrentSubject
          title="Current subject"
          chart={{
            categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
            series: [
              { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
              { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
              { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={8}>
        <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AnalyticsTrafficBySite
          title="Traffic by site"
          list={[
            { value: 'facebook', label: 'Facebook', total: 323234 },
            { value: 'google', label: 'Google', total: 341212 },
            { value: 'linkedin', label: 'Linkedin', total: 411213 },
            { value: 'twitter', label: 'Twitter', total: 443232 },
          ]}
        />
      </Grid>
      */}
    </DashboardContent>
  );
}
