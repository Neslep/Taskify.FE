import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import FolderZipTwoToneIcon from '@mui/icons-material/FolderZipTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: icon('ic-user'),
  },
  {
    title: 'Calendar',
    path: '/Calendar',
    icon: <CalendarMonthTwoToneIcon />,
    proOnly: true,
  },
  {
    title: 'Kanban',
    path: '/kanban',
    icon: <ViewKanbanIcon />,
    proOnly: true,
  },
  {
    title: 'File Management',
    path: '/file-management',
    icon: <FolderZipTwoToneIcon />,
    proOnly: true,
  },
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // }
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
