import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/LockOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { API_BASE_URL } from '../../../config';
import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    proOnly?: boolean; // Đánh dấu những mục chỉ dành cho gói Pro/Premium
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.12
        )})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ plans: number } | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      const response = await fetch(`${API_BASE_URL}api/users/profile`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Lấy thông tin user không thành công');
      }

      const result = await response.json();
      if (result.isSuccess) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Xác định label của plan dựa trên thông tin user (0: Free, 1: Pro)
  const currentPlanLabel = user !== null ? (user.plans === 0 ? 'Free' : 'Premium') : null;

  // Đảm bảo workspaces luôn là một mảng (nếu undefined thì dùng mảng rỗng)
  const safeWorkspaces = workspaces ?? [];

  // Nếu có thông tin user, cập nhật dữ liệu workspaces: nếu ws.plan không khớp với plan của user thì disabled
  const workspacesWithDisabled =
    currentPlanLabel !== null
      ? safeWorkspaces.map((ws) => ({
          ...ws,
          disabled: ws.plan !== currentPlanLabel,
        }))
      : safeWorkspaces;

  return (
    <>
      <Logo />

      {slots?.topArea}

      {/* Truyền dữ liệu workspaces đã cập nhật vào WorkspacesPopover */}
      <WorkspacesPopover data={workspacesWithDisabled} sx={{ my: 2 }} />

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;
              const isProOnly = item.proOnly;
              // true nếu mục chỉ dành cho Pro và user đang ở gói Free
              const showLockIcon = isProOnly && user && user.plans === 0;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    {/* Icon của item */}
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    {/* Tên menu + LockIcon nếu cần */}
                    <Box component="span" flexGrow={1} display="flex" alignItems="center" gap={1}>
                      {item.title}
                      {showLockIcon && (
                        <Tooltip title="Chỉ dành cho tài khoản Premium" arrow>
                          <LockIcon
                            sx={{
                              fontSize: 20, // to hơn chút so với mặc định
                              color: 'grey.500',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      {/* Chỉ hiển thị NavUpgrade nếu user đã load và đang dùng gói Free */}
      {user !== null && user.plans === 0 && <NavUpgrade />}
    </>
  );
}
