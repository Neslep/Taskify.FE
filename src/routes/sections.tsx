import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes, useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { AuthContext } from 'src/contexts/AuthContext';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const ProjectPage = lazy(() => import('src/pages/projects'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Calendar = lazy(() => import('src/pages/Calendar'));
export const ProjectDetail = lazy(() => import('src/pages/projects-detail'));
export const Kanban = lazy(() => import('src/pages/kanban'));
export const FileManagement = lazy(() => import('src/pages/file-management'));
export const CreateUserPage = lazy(() => import('src/pages/create-user'));
export const PaymentPage = lazy(() => import('src/pages/payment'));

// ----------------------------------------------------------------------

// Fallback loading component
const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Component bảo vệ các tính năng Pro
function RequirePro({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return renderFallback;

  if (user && user.plans === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This feature is available only for Premium users. Please upgrade your plan to access this
          feature!
        </Alert>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/payment', { state: { from: location } })}
        >
          Upgrade to Premium Now 🚀
        </Button>
      </Box>
    );
  }

  return children;
}

export function Router() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  const routeConfig = loading
    ? [{ path: '*', element: renderFallback }]
    : [
        {
          element: isAuthenticated ? (
            <DashboardLayout>
              <Suspense fallback={renderFallback}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          ) : (
            <Navigate to="/sign-in" replace />
          ),
          children: [
            { element: <HomePage />, index: true },
            { path: 'projects', element: <ProjectPage /> },
            {
              path: 'calendar',
              element: (
                <RequirePro>
                  <Calendar />
                </RequirePro>
              ),
            },
            {
              path: 'kanban',
              element: (
                <RequirePro>
                  <Kanban />
                </RequirePro>
              ),
            },
            {
              path: 'file-management',
              element: (
                <RequirePro>
                  <FileManagement />
                </RequirePro>
              ),
            },
            { path: 'projects/projectDetail', element: <ProjectDetail /> },
            {
              path: 'payment',
              element: <PaymentPage />,
            },
          ],
        },
        {
          path: 'sign-in',
          element: (
            <AuthLayout>
              <Suspense fallback={renderFallback}>
                <SignInPage />
              </Suspense>
            </AuthLayout>
          ),
        },
        {
          path: '404',
          element: <Page404 />,
        },
        {
          path: '*',
          element: <Navigate to="/404" replace />,
        },
        {
          path: 'sign-up',
          element: (
            <AuthLayout>
              <Suspense fallback={renderFallback}>
                <CreateUserPage />
              </Suspense>
            </AuthLayout>
          ),
        },
      ];

  const routes = useRoutes(routeConfig);
  return routes;
}
