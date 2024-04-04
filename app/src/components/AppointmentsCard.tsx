import React, { useContext, useState } from "react";
import "../styles/AppointmentsCard.scss";
import { Button } from "semantic-ui-react";
import { boolean } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./sidebar/searchBar";
import { AppointmentsContext } from "../contexts/appointmentsContext";
import { StaffContext } from "../contexts/staffContext";

const appointmentsData = [
  {
    id: 1,
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    time: "10:00 AM",
    checkIn: false,
  },
  {
    id: 2,
    patientName: "Jane Doe",
    doctorName: "Dr. Johnson",
    time: "11:00 AM",
    checkIn: false,
  },
  {
    id: 3,
    patientName: "Bob Builder",
    doctorName: "Dr. Brown",
    time: "12:00 PM",
    checkIn: false,
  },
  {
    id: 4,
    patientName: "Sam Jam",
    doctorName: "Dr. Johnson",
    time: "12:00 PM",
    checkIn: false,
  },
  {
    id: 5,
    patientName: "Jack Dan",
    doctorName: "Dr. Smith",
    time: "12:00 PM",
    checkIn: false,
  },
  {
    id: 6,
    patientName: "Man Manson",
    doctorName: "Dr. Johnson",
    time: "1:00 PM",
    checkIn: false,
  },
  {
    id: 7,
    patientName: "Mary Mars",
    doctorName: "Dr. Johnson",
    time: "2:00 PM",
    checkIn: false,
  },
];
export default function AppointmentsCard() {
  const {
    setSelectedAppointment,
    setOpenExistingAppointmentModal,
    editAppointment,
  } = useContext(AppointmentsContext);
  const { staff, setDate, setView, setSelectedStaff } =
    useContext(StaffContext);
  const { appointments } = useContext(AppointmentsContext);
  const [searchTerm, setSearchTerm] = useState("");

  //filter date
  const today = new Date();
  if (today.getDay() === 0) {
    today.setDate(today.getDate() + 1);
  }
  if (today.getDay() === 6) {
    today.setDate(today.getDate() + 2);
  }
  const todayDate = today.getDate();

  const filterToday = appointments.filter((a) => {
    return a.start.getDate() === todayDate;
  });

  let filtered = filterToday;
  if (searchTerm !== "") {
    filtered = filterToday.filter((a) => {
      return (
        a.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.staff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.start
          .toLocaleString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        a.end.toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  let sorted = filtered.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });

  const handleCheckIn = (appointment: any, checked: boolean) => {
    editAppointment(appointment.id, { ...appointment, checkIn: checked });
  };

  return (
    <div>
      <div className="appointmentsCardHeader">
        <h1 className={"text-primary"}>
          <FontAwesomeIcon icon={faCalendarCheck} className={"me-3"} />
          Appointments for Today
        </h1>
      </div>
      <div className={"flex justify-center mb-7"}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          short={true}
        />
      </div>
      <div className="appointmentsCardWrapper">
        <div className="cardHeader">
          <h3>Patient Name</h3>
          <h3>Doctor Name</h3>
          <h3>Time</h3>
          <h3>Actions</h3>
        </div>
        <div className="cardBody">
          {sorted.length > 0 ? (
            sorted.map((appointment, index) => {
              return (
                <div className="appointmentCard" key={index}>
                  <p className={"text-center"}>{appointment.client}</p>
                  <p className={"text-center"}>{appointment.staff}</p>
                  <p className={"text-center"}>
                    {appointment.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="flex justify-center items-center gap-3">
                    {/*<Button primary>Check In</Button>*/}
                    <div className={"flex items-center w-full justify-center"}>
                      <label className="inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          checked={appointment.checkIn}
                          className="sr-only peer"
                          onChange={(event) =>
                            handleCheckIn(appointment, event.target.checked)
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Checked In
                        </span>
                      </label>
                    </div>

                    <div>
                      <button
                        className={
                          "bg-green-600 text-white py-3 font-bold hover:scale-110 rounded-lg"
                        }
                        onClick={() => {
                          setSelectedStaff(
                            staff.filter((s) => s.id == appointment.staffId)[0]
                          );
                          setView("week");
                          setDate(appointment.start);
                        }}
                      >
                        Follow Up
                      </button>
                    </div>

                    <button
                      className={
                        "bg-primary text-white py-3 font-bold hover:scale-110 rounded-lg"
                      }
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setOpenExistingAppointmentModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={"mt-3 text-center font-semibold text-2xl"}>
              No result found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
