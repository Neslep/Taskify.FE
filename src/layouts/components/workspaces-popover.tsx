import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';

export type WorkspacesPopoverProps = BoxProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
    disabled?: boolean;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  // Lọc ra các workspace không bị disabled (theo plan của user)
  const availableWorkspaces = data.filter((ws) => !ws.disabled);
  // Nếu có workspace hợp lệ, lấy workspace đầu tiên; nếu không, fallback về workspace đầu tiên có trong data
  const workspace = availableWorkspaces[0] || data[0];

  const renderAvatar = (alt: string, src: string) => (
    <Box component="img" alt={alt} src={src} sx={{ width: 24, height: 24, borderRadius: '50%' }} />
  );

  const renderLabel = (plan: string) => (
    <Label color={plan === 'Free' ? 'default' : 'info'}>{plan}</Label>
  );

  return (
    <Box
      sx={{
        pl: 2,
        py: 3,
        gap: 1.5,
        pr: 1.5,
        width: 1,
        borderRadius: 1.5,
        textAlign: 'left',
        justifyContent: 'flex-start',
        bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      {renderAvatar(workspace?.name, workspace?.logo)}
      <Box
        gap={1}
        flexGrow={1}
        display="flex"
        alignItems="center"
        sx={{ typography: 'body2', fontWeight: 'fontWeightSemiBold' }}
      >
        {workspace?.name}
        {renderLabel(workspace?.plan)}
      </Box>
    </Box>
  );
}
