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
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
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
    id: _id(1),
    title: 'Project Alpha Deadline Approaching',
    description: 'The deadline for Project Alpha is in 3 days. Please ensure all tasks are completed.',
    avatarUrl: null,
    type: 'deadline',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: 'Team Meeting Scheduled',
    description: 'A team meeting has been scheduled for tomorrow at 10 AM to discuss project progress.',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'meeting',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'Task Update: Design Phase',
    description: 'The design phase of Project Beta has been completed. Moving on to development.',
    avatarUrl: '/assets/images/avatar/avatar-3.webp',
    type: 'task-update',
    postedAt: _times(3),
    isUnRead: true,
  },
  {
    id: _id(4),
    title: 'New Task Assigned',
    description: 'You have been assigned a new task: "Implement authentication module".',
    avatarUrl: '/assets/images/avatar/avatar-4.webp',
    type: 'task-assigned',
    postedAt: _times(4),
    isUnRead: true,
  },
  {
    id: _id(5),
    title: 'Project Gamma Completed',
    description: 'Congratulations! Project Gamma has been successfully completed.',
    avatarUrl: '/assets/images/avatar/avatar-5.webp',
    type: 'project-completed',
    postedAt: _times(5),
    isUnRead: true,
  },
];
