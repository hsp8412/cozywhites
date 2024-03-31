import dent from "../components/dent.png";
import hyg from "../components/hyg.png";
import { Patient, PatientsContext } from "./patientsContext";
import { createContext, ReactNode, useEffect, useState } from "react";
import { View } from "react-big-calendar";

export const staffData = [
  { id: "1", name: "Dr. Smith", type: "Dentist", avatar: dent },
  { id: "2", name: "John Grey", type: "Hygienist", avatar: hyg },
];

type Staff = {
  id: string | number;
  name: string;
  type: string;
  avatar: string;
};

type StaffContext = {
  staff: Staff[];
  selectedStaff: Staff | null;
  setSelectedStaff: (staff: Staff | null) => void;
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  resetCalendar: () => void;
};

export const StaffContext = createContext<StaffContext>({
  staff: [],
  selectedStaff: null,
  setSelectedStaff: () => {},
  view: "week",
  setView: () => {},
  date: new Date(),
  setDate: () => {},
  resetCalendar: () => {},
});

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<Staff[]>(staffData);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());

  const resetCalendar = () => {
    setView("week");
    setDate(new Date());
  };
  return (
    <StaffContext.Provider
      value={{
        staff,
        selectedStaff,
        setSelectedStaff,
        view,
        setView,
        date,
        setDate,
        resetCalendar,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
