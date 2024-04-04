import React, { useContext, useState } from "react";
import { PatientsContext } from "../../contexts/patientsContext";
import SearchBar from "./searchBar";
import { AppointmentsContext } from "../../contexts/appointmentsContext";
import { StaffContext } from "../../contexts/staffContext";

const AppointmentsTab = () => {
  const {
    appointments,
    setSelectedAppointment,
    setOpenExistingAppointmentModal,
  } = useContext(AppointmentsContext);
  const { patients } = useContext(PatientsContext);
  const { staff, setSelectedStaff, setView, setDate } =
    useContext(StaffContext);
  const [searchTerm, setSearchTerm] = useState("");

  let todayOrFutureAppointments = appointments.filter((a) => {
    const appointmentDate = new Date(a.start); // Create a copy of the appointment start date
    appointmentDate.setHours(0, 0, 0, 0); // Set time to start of the day for the appointment date

    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set time to start of the day for today
    console.log(a, appointmentDate >= today);
    return appointmentDate >= today; // Check if the appointment is today or in the future
  });

  let filteredAppointments = todayOrFutureAppointments;
  if (searchTerm !== "") {
    filteredAppointments = todayOrFutureAppointments.filter((a) => {
      return (
        a.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.staff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.start.toLocaleDateString("en-US").includes(searchTerm) ||
        patients
          .filter((p) => p.id == a.clientId)[0]
          .phoneNumber.includes(searchTerm) ||
        patients
          .filter((p) => p.id == a.clientId)[0]
          .email?.includes(searchTerm)
      );
    });
  }

  return (
    <div className="tabContainer flex flex-col items-center py-5 w-full">
      <p className={"text-gray-600 font-bold"}>
        Instructions: select an appointment to edit/cancel it.
      </p>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {filteredAppointments.length > 0 ? (
        <div className={"flex flex-col items-center gap-10 w-9/12 mt-5"}>
          {filteredAppointments.map((appointment, index) => {
            return (
              <div
                key={index}
                className="w-full flex flex-col justify-center items-center py-4 px-5 shadow-xl rounded bg-tertiary hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setOpenExistingAppointmentModal(true);
                  setSelectedStaff(
                    staff.filter((s) => s.id == appointment.staffId)[0]
                  );
                  setView("day");
                  setDate(appointment.start);
                }}
              >
                <div className={"mb-3"}>
                  <p className={"text-2xl font-bold text-gray-600"}>
                    {appointment.start.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="header text-center">
                  <p className={"text-xl font-semibold"}>
                    {appointment.start.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                    -
                    {appointment.end.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}{" "}
                  </p>
                </div>
                <div className="mt-2">
                  <p>
                    <strong>Patient:</strong> {appointment.client}
                  </p>
                  <p>
                    <strong>Staff:</strong> {appointment.staff}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={"mt-3"}>No result found</div>
      )}
    </div>
  );
};

export default AppointmentsTab;
