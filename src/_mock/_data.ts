import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'EXE101 - Group 4',
  email: 'demo@exe101.group4',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? 'active' : 'banned',
  role:
    [
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index] || 'UI Designer',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    'Done Create Table on Twitter App',
    'Design UI Facebok Application 85%',
    'Done Task on City Advertising Campaign',
    'Inprogress Create New Theme for Website',
    'Pick task from Kanban and start',
    'Start Tasks Web Application Development',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

// ----------------------------------------------------------------------

export const _tasks = [...Array(5)].map((_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(2),
    title: 'Welcome to Taskify!',
    description: 'Welcome to Taskify! Have a great journey with us!.',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'welcome',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'Upgrade to PREMIUM Today!',
    description: 'Unlock all features and boost your productivity with Taskify Premium!',
    avatarUrl: '/assets/images/avatar/avatar-3.webp',
    type: 'promotion',
    postedAt: _times(3),
    isUnRead: true,
  },
  {
    id: _id(4),
    title: 'Need Help? Contact Our Support!',
    description:
      'Having trouble getting started? Our support team is here for you. Reach out anytime!',
    avatarUrl: '/assets/images/avatar/avatar-4.webp',
    type: 'support',
    postedAt: _times(5),
    isUnRead: true,
  },
  {
    id: _id(5),
    title: 'Quick Start Guide 📖',
    description:
      'Check out our guide to learn how to create tasks, manage projects, and collaborate with your team!',
    avatarUrl: '/assets/images/avatar/avatar-5.webp',
    type: 'guide',
    postedAt: _times(8),
    isUnRead: true,
  },
  {
    id: _id(6),
    title: 'Invite Your Team! 👥',
    description:
      'Taskify works best with your team. Invite your colleagues and start collaborating today!',
    avatarUrl: '/assets/images/avatar/avatar-6.webp',
    type: 'invite',
    postedAt: _times(10),
    isUnRead: true,
  },
];
