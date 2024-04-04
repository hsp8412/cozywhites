import React, { createContext, ReactNode, useState } from "react";
import { View } from "react-big-calendar";
import App from "../App";
import { forEach } from "lodash";

export type Appointment = {
  id: string | number;
  start: Date;
  end: Date;
  title: string;
  type: string;
  client: string;
  staff: string;
  staffId?: string | number;
  clientId?: string | number;
  checkIn: boolean;
};

type AppointmentsContextType = {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  editAppointment: (
    appointmentId: string | number,
    updatedAppointment: Appointment
  ) => void;
  deleteAppointment: (appointmentId: string | number) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  openExistingAppointmentModal: boolean;
  setOpenExistingAppointmentModal: (open: boolean) => void;
};

type Props = {
  children: ReactNode;
};

const getToday = () => {
  const today = new Date();
  if (today.getDay() === 0) {
    today.setDate(today.getDate() + 1);
  }
  if (today.getDay() === 6) {
    today.setDate(today.getDate() + 2);
  }
  today.setHours(0, 0, 0, 0);
  return today;
};

const initialAppointments: Appointment[] = [
  {
    id: "1",
    start: new Date(getToday().setHours(16, 0, 0, 0)),
    end: new Date(getToday().setHours(17, 0, 0, 0)),
    title: "Checkup with Alice Green",
    type: "Checkup",
    client: "Alice Green",
    staff: "Dr. Smith",
    clientId: 1,
    staffId: 1,
    checkIn: false,
  },
  {
    id: "2",
    start: new Date(getToday().setHours(10, 0, 0, 0)),
    end: new Date(getToday().setHours(11, 0, 0, 0)),
    title: "Cleaning with James Brown",
    type: "Cleaning",
    client: "James Brown",
    staff: "Dr. Smith",
    clientId: 2,
    staffId: 1,
    checkIn: false,
  },
  {
    id: "3",
    start: new Date(getToday().setHours(9, 0, 0, 0)),
    end: new Date(getToday().setHours(10, 0, 0, 0)),
    title: "Filling with John Doe",
    type: "Filling",
    client: "John Doe",
    staff: "Dr. Smith",
    clientId: 3,
    staffId: 1,
    checkIn: false,
  },
  {
    id: "4",
    start: new Date(getToday().setHours(9, 0, 0, 0)),
    end: new Date(getToday().setHours(10, 0, 0, 0)),
    title: "Checkup with Jane Doe",
    type: "Checkup",
    client: "Jane Doe",
    staff: "John Grey",
    clientId: 4,
    staffId: 2,
    checkIn: false,
  },
  {
    id: "5",
    start: new Date(getToday().setHours(8, 0, 0, 0)),
    end: new Date(getToday().setHours(9, 0, 0, 0)),
    title: "Filling with Jane Doe",
    type: "Filling",
    client: "Jane Doe",
    staff: "John Grey",
    clientId: 4,
    staffId: 2,
    checkIn: false,
  },
  {
    id: "6",
    start: new Date(getToday().setHours(14, 0, 0, 0)),
    end: new Date(getToday().setHours(15, 0, 0, 0)),
    title: "Cleaning with Tom Lee",
    type: "Cleaning",
    client: "Tom Lee",
    staff: "Dr. Smith",
    clientId: 5,
    staffId: 1,
    checkIn: false,
  },
  {
    id: "7",
    start: new Date("2024-03-29T09:00:00"),
    end: new Date("2024-03-29T10:00:00"),
    title: "Cleaning with Tom Lee",
    type: "Cleaning",
    client: "Tom Lee",
    staff: "Dr. Smith",
    clientId: 5,
    staffId: 1,
    checkIn: false,
  },
];

// Creating the context
export const AppointmentsContext = createContext<AppointmentsContextType>({
  appointments: initialAppointments,
  addAppointment: () => {},
  editAppointment: () => {},
  deleteAppointment: () => {},
  selectedAppointment: null,
  setSelectedAppointment: () => {},
  openExistingAppointmentModal: false,
  setOpenExistingAppointmentModal: () => {},
});

// Provider component
export const AppointmentsProvider = ({ children }: Props) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openExisting, setOpenExisting] = useState(false);

  // Function to add a new appointment
  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  // Function to edit an existing appointment
  const editAppointment = (
    appointmentId: string | number,
    updatedAppointment: Appointment
  ) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId ? updatedAppointment : appointment
      )
    );
  };

  // Function to delete an appointment
  const deleteAppointment = (appointmentId: string | number) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  const checkIn = (appointmentId: string | number) => {};

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        editAppointment,
        deleteAppointment,
        selectedAppointment,
        setSelectedAppointment,
        openExistingAppointmentModal: openExisting,
        setOpenExistingAppointmentModal: setOpenExisting,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};
