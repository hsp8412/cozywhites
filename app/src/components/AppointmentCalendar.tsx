import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer, SlotInfo, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/AppointmentCalendar.scss";
import AppointmentModal from "./AppointmentModal";
import { PatientsContext } from "../contexts/patientsContext";
import { AppointmentsContext } from "../contexts/appointmentsContext";
import { StaffContext } from "../contexts/staffContext";
import { toast } from "react-toastify";
const localizer = momentLocalizer(moment);

export default function AppointmentCalendar() {
  const [open, setOpen] = useState(false);

  const [slotInfo, setSlotInfo] = useState<SlotInfo>();
  const [events, setEvents]: any = useState([]);
  const [selectedEvent, setSelectedEvent]: any = useState(null);
  const { patients, createPatient, selectedPatient, setSelectedPatient } =
    useContext(PatientsContext);
  const {
    appointments,
    addAppointment,
    editAppointment,
    deleteAppointment,
    selectedAppointment,
    setSelectedAppointment,
    openExistingAppointmentModal,
    setOpenExistingAppointmentModal,
  } = useContext(AppointmentsContext);
  const { selectedStaff, view, date, setView, setDate } =
    useContext(StaffContext);

  const filteredByStaff = appointments.filter(
    (a) => a.staffId == selectedStaff?.id
  );

  // const events = [
  //     {
  //         start: moment().toDate(),
  //         end: moment().add(1, 'hour').toDate(),
  //         title: "Sample Appointment",
  //     },
  // ];

  // const handleAddEvent = (appointmentData: any) => {
  //   const {
  //     start,
  //     end,
  //     title,
  //     type,
  //     client,
  //     staff,
  //     notes,
  //     email,
  //     phoneNumber,
  //     id,
  //   } = appointmentData;
  //   const filteredEvents = events.filter((event: any) => event.id !== id);
  //   createPatient({
  //     id: crypto.randomUUID(),
  //     name: client,
  //     gender: "",
  //     phoneNumber: phoneNumber,
  //     address: "123 Main St",
  //     email: email,
  //     dob: new Date("1990-01-01"),
  //     insurance: "",
  //     createdAt: new Date(),
  //     notes: "",
  //   });
  //   setEvents([
  //     ...filteredEvents,
  //     {
  //       start,
  //       end,
  //       title,
  //       type,
  //       client,
  //       staff,
  //       notes,
  //       email,
  //       phoneNumber,
  //       id,
  //     },
  //   ]);
  //   addAppointment({
  //     id,
  //     start,
  //     end,
  //     title,
  //     type,
  //     client,
  //     staff,
  //   });
  // };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const conflict = filteredByStaff.some(
      (app) => app.start.toLocaleString() === slotInfo.start.toLocaleString()
    );

    if (conflict) {
      return;
    }

    if (view === "month") {
      toast.info("Please switch to week or day view to add an appointment");
    }

    if (slotInfo.start < new Date()) {
      toast.info("Please select a timeslot in the future");
      return;
    }

    if (
      slotInfo.start.getHours() === 12 ||
      slotInfo.start.getHours() < 8 ||
      slotInfo.start.getHours() > 16 ||
      slotInfo.start.getDay() % 6 === 0
    ) {
      toast.info(
        "Please select a valid time slot during working hours (Mon-Fri, 8am-11am & 1pm-5pm)"
      );
      return;
    }

    setSlotInfo(slotInfo);
    setOpen(true);
  };
  const handleSelectEvent = (event: any) => {
    console.log("event", event);
    setOpenExistingAppointmentModal(true);
    setSelectedAppointment(appointments.filter((a) => a.id === event.id)[0]);
    // Here you can handle the event click, for example open a modal with the event data
  };

  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(17, 0, 0);

  const handleCancelEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event: any) => event.id !== selectedEvent.id));
      setSelectedEvent(null); // Clear the selected event
    }
  };

  // set the properties of each calendar timeslot
  // based on some conditions
  const slotPropGetter = (date: Date) => {
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    const isBefore = date < new Date();
    const isNoon = date.getHours() === noon.getHours();
    const isWeekend = date.getDay() % 6 === 0;
    const isDisabled = isNoon || isWeekend;
    if (isDisabled) {
      return {
        className: "disabled-slot",
      };
    }
    return { className: "" };
  };

  const eventStyleGetter = (
    event: any,
    start: any,
    end: any,
    isSelected: any
  ) => {
    let backgroundColor = "#3174ad"; // default color
    let fontSize = "14px";
    if (event.type.toLowerCase() === "filling") {
      backgroundColor = "#1db552";
    } else if (event.type.toLowerCase() === "cleaning") {
      backgroundColor = "#f03e1a";
    } else if (event.type.toLowerCase() === "crown replacement") {
      backgroundColor = "#f0a71a";
      fontSize = "11px";
    } else if (event.type.toLowerCase() === "gum treatment") {
      backgroundColor = "#b31af0";
      fontSize = "12px";
    }
    // Add more conditions for other types with their respective colors
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "3px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      fontSize: fontSize,
    };
    return {
      style: style,
    };
  };

  return (
    <div className={"w-full"}>
      <AppointmentModal open={open} setOpen={setOpen} slotInfo={slotInfo} />
      <div className="calendarWrapper">
        <Calendar
          localizer={localizer}
          events={filteredByStaff}
          startAccessor="start"
          endAccessor="end"
          step={60}
          defaultView="week"
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          min={minTime}
          max={maxTime}
          style={{ height: 600 }}
          slotPropGetter={slotPropGetter}
          timeslots={1}
          view={view}
          onView={(view) => setView(view)}
          date={date}
          onNavigate={(date) => setDate(date)}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}
