import type { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useRef, useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Menu,
  Dialog,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  ButtonGroup,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

// ----------------------------------------------------------------------

// Sử dụng bảng màu pastel nhẹ nhàng
const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#C9C9FF', '#FFC9DE'];

const getDefaultEventInitValue = () => ({
  id: faker.string.uuid(),
  title: '',
  description: '',
  allDay: false,
  start: dayjs(),
  end: dayjs(),
  color: colors[0],
});

export default function CalendarView() {
  const fullCalendarRef = useRef<FullCalendar>(null);
  const [date] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [eventInitValue, setEventInitValue] = useState(getDefaultEventInitValue());
  const [eventFormType, setEventFormType] = useState<'add' | 'edit'>('add');
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>(() => {
    const stored = localStorage.getItem('calendarEvents');
    return stored ? JSON.parse(stored) : [];
  });
  const [titleError, setTitleError] = useState('');

  // State cho dropdown view
  const [viewName, setViewName] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>(
    'dayGridMonth'
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Map viewName sang text hiển thị
  const viewsMap = {
    dayGridMonth: 'Month',
    timeGridWeek: 'Week',
    timeGridDay: 'Day',
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setCalendarEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Khi viewName thay đổi, cập nhật FullCalendar view
  useEffect(() => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(viewName);
    }
  }, [viewName]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setOpen(true);
    setEventFormType('add');
    setEventInitValue({
      ...getDefaultEventInitValue(),
      start: dayjs(selectInfo.startStr),
      end: dayjs(selectInfo.endStr),
      allDay: selectInfo.allDay,
    });
    setTitleError('');
  };

  const handleEventClick = (arg: EventClickArg) => {
    const { title, extendedProps, allDay, start, end, backgroundColor, id } = arg.event;
    setOpen(true);
    setEventFormType('edit');
    setEventInitValue({
      id,
      title,
      allDay,
      color: backgroundColor,
      description: extendedProps.description,
      start: dayjs(start),
      end: dayjs(end),
    });
    setTitleError('');
  };

  const handleCancel = () => {
    setEventInitValue(getDefaultEventInitValue());
    setOpen(false);
    setTitleError('');
  };

  const handleCreateOrEdit = () => {
    if (!eventInitValue.title.trim()) {
      setTitleError('Title cannot be blank!');
      return;
    }
    const { id, title, description, start, end, allDay, color } = eventInitValue;
    const newEvent: EventInput = {
      id,
      title,
      allDay,
      color,
      start: start.toDate(),
      end: end.toDate(),
      extendedProps: { description },
    };
    if (eventFormType === 'edit') {
      setCalendarEvents((prev) => prev.map((event) => (event.id === id ? newEvent : event)));
    } else {
      setCalendarEvents((prev) => [...prev, newEvent]);
    }
    handleCancel();
  };

  const handleDelete = () => {
    setCalendarEvents((prev) => prev.filter((event) => event.id !== eventInitValue.id));
    handleCancel();
  };

  // Hàm cho dropdown view với chữ ký phù hợp: (ev: MouseEvent, element: HTMLElement) => void
  const handleOpenMenuCustom = (ev: MouseEvent, element: HTMLElement) => {
    setAnchorEl(element);
  };

  const handleCloseMenu = (selectedView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    if (selectedView) {
      setViewName(selectedView);
    }
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '95%',
          height: '95%',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <FullCalendar
          ref={fullCalendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialDate={date}
          initialView={viewName}
          selectable
          editable
          events={calendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'customViews',
          }}
          customButtons={{
            customViews: {
              text: viewsMap[viewName],
              click: handleOpenMenuCustom,
            },
          }}
          buttonText={{ today: 'Today' }}
          height="80vh"
        />

        {/* Dropdown menu cho việc chọn view */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleCloseMenu()}>
          {(Object.keys(viewsMap) as Array<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>).map(
            (key) => (
              <MenuItem key={key} onClick={() => handleCloseMenu(key)}>
                {viewsMap[key]}
              </MenuItem>
            )
          )}
        </Menu>

        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{
              typography: 'h5',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px 8px 0 0',
            }}
          >
            {eventFormType === 'add' ? 'Create Event' : 'Edit Event'}
          </DialogTitle>
          <DialogContent sx={{ p: 3, bgcolor: 'grey.50' }}>
            <TextField
              label="Title"
              fullWidth
              value={eventInitValue.title}
              onChange={(e) => {
                setEventInitValue({ ...eventInitValue, title: e.target.value });
                if (e.target.value.trim()) {
                  setTitleError('');
                }
              }}
              error={Boolean(titleError)}
              helperText={titleError}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventInitValue.description}
              onChange={(e) =>
                setEventInitValue({ ...eventInitValue, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={eventInitValue.start}
                onChange={(newValue) =>
                  setEventInitValue({ ...eventInitValue, start: newValue || dayjs() })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mb: 2 },
                  },
                }}
              />
              <DateTimePicker
                label="End Time"
                value={eventInitValue.end}
                onChange={(newValue) =>
                  setEventInitValue({ ...eventInitValue, end: newValue || dayjs() })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mb: 2 },
                  },
                }}
              />
            </LocalizationProvider>

            <FormControlLabel
              control={
                <Switch
                  checked={eventInitValue.allDay}
                  onChange={(e) =>
                    setEventInitValue({ ...eventInitValue, allDay: e.target.checked })
                  }
                />
              }
              label="All Day"
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Choose Event Color:
              </Typography>
              <ButtonGroup>
                {colors.map((color) => (
                  <Button
                    key={color}
                    onClick={() => setEventInitValue({ ...eventInitValue, color })}
                    sx={{
                      bgcolor: color,
                      width: 30,
                      height: 30,
                      minWidth: 30,
                      borderRadius: '50%',
                      m: 0.5,
                      '&:hover': { opacity: 0.8 },
                      boxShadow: eventInitValue.color === color ? 3 : 0,
                    }}
                  />
                ))}
              </ButtonGroup>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            {eventFormType === 'edit' && (
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            )}
            <Button
              variant="contained"
              color={eventFormType === 'add' ? 'primary' : 'success'}
              onClick={handleCreateOrEdit}
            >
              {eventFormType === 'add' ? 'Create' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="inherit">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
