import './CalendarView.css'; // Import CSS file
import type { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Dialog, Button, Switch, TextField, DialogTitle, ButtonGroup, DialogActions, DialogContent, FormControlLabel } from '@mui/material';
// import { DatePicker, TimePicker } from 'antd'; // Import Ant Design components

// Color options for event creation
const colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0'];

const DefaultEventInitValue = {
  id: faker.string.uuid(),
  title: '',
  description: '',
  allDay: false,
  start: dayjs(),
  end: dayjs(),
  color: colors[0], // Default color
};

export default function CalendarView() {
  const fullCalendarRef = useRef<FullCalendar>(null);
  const [view] = useState('dayGridMonth');
  const [date] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [eventInitValue, setEventInitValue] = useState(DefaultEventInitValue);
  const [eventFormType, setEventFormType] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    const calendarApi = fullCalendarRef.current!.getApi();
    calendarApi.changeView(view);
  }, [view]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    setOpen(true);
    setEventFormType('add');
    setEventInitValue({
      ...DefaultEventInitValue,
      start: dayjs(selectInfo.startStr),
      end: dayjs(selectInfo.endStr),
      allDay: selectInfo.allDay,
    });
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
  };

  const handleCancel = () => {
    setEventInitValue(DefaultEventInitValue);
    setOpen(false);
  };

  const handleCreateOrEdit = () => {
    const calendarApi = fullCalendarRef.current!.getApi();
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
      const oldEvent = calendarApi.getEventById(id);
      oldEvent?.remove();
    }
    calendarApi.addEvent(newEvent);
    handleCancel();
  };

  const handleDelete = () => {
    const calendarApi = fullCalendarRef.current!.getApi();
    calendarApi.getEventById(eventInitValue.id)?.remove();
    handleCancel();
  };

  return (
    <Box className="parent-container">
      <Box className="calendar-container">
        <FullCalendar
          ref={fullCalendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialDate={date}
          initialView={view}
          selectable
          editable
          events={[]}
          select={handleDateSelect}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          customButtons={{
            today: {
              text: 'Today',
              click: () => {
                const calendarApi = fullCalendarRef.current!.getApi();
                calendarApi.today();
              },
            },
          }}
          buttonText={{
            today: 'Today',
          }}
          height="80vh"
        />

        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
          <DialogTitle className="dialog-title">
            {eventFormType === 'add' ? 'Create Event' : 'Edit Event'}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              label="Title"
              fullWidth
              value={eventInitValue.title}
              onChange={(e) => setEventInitValue({ ...eventInitValue, title: e.target.value })}
              className="text-field"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventInitValue.description}
              onChange={(e) => setEventInitValue({ ...eventInitValue, description: e.target.value })}
              className="text-field"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={eventInitValue.allDay}
                  onChange={(e) => setEventInitValue({ ...eventInitValue, allDay: e.target.checked })}
                />
              }
              label="All Day"
            />
            {/* <DatePicker */}
            {/*   showTime */}
            {/*   label="Start Date & Time" */}
            {/*   value={eventInitValue.start.toDate()} */}
            {/*   onChange={(newValue: any) => setEventInitValue({ ...eventInitValue, start: dayjs(newValue) })} */}
            {/*   className="text-field" */}
            {/* /> */}
            {/* <DatePicker */}
            {/*   showTime */}
            {/*   label="End Date & Time" */}
            {/*   value={eventInitValue.end.toDate()} */}
            {/*   onChange={(newValue: any) => setEventInitValue({ ...eventInitValue, end: dayjs(newValue) })} */}
            {/*   className="text-field" */}
            {/* /> */}
            {/* Color Selection */}
            <Box className="color-selection">
              <div>Choose Event Color:</div>
              <ButtonGroup className="color-button-group">
                {colors.map((color) => (
                  <Button
                    key={color}
                    onClick={() => setEventInitValue({ ...eventInitValue, color })}
                    className={`color-button ${eventInitValue.color === color ? 'selected-color' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </ButtonGroup>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            {eventFormType === 'edit' && (
              <Button onClick={handleDelete} className="delete-button">Delete</Button>
            )}
            <Button onClick={handleCreateOrEdit} className="save-button">
              {eventFormType === 'add' ? 'Create' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}