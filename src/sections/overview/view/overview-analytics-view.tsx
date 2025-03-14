import Grid from '@mui/material/Unstable_Grid2';
import TaskIcon from '@mui/icons-material/Task';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { _tasks } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsTasks } from '../analytics-tasks';
import RecentProjects from '../RecentProjects/RecentProjects';
import {AnalyticsUserMember } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back👋
      </Typography>

      <Grid container spacing={3}>
        {/* ====== 4 WIDGET TÓM TẮT ====== */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Projects"
            percent={0}
            total={5}
            icon={<AssignmentIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tasks"
            percent={0}
            total={3}
            color="secondary"
            icon={<TaskIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Members"
            percent={0}
            total={15}
            color="warning"
            icon={<PeopleIcon />}
            chart={{
              series: [],
              categories: [],
              options: undefined,
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
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
          />
        </Grid>

        {/* ====== 3 COMPONENT CHÍNH BÊN DƯỚI ====== */}
        <Grid xs={12} md={4}>
          <RecentProjects />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsUserMember title="User Member" list={[]} />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
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
