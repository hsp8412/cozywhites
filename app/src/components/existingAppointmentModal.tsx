import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Appointment,
  AppointmentsContext,
} from "../contexts/appointmentsContext";
import { Patient, PatientsContext } from "../contexts/patientsContext";
import {
  Button,
  Dropdown,
  Icon,
  Modal,
  ModalContent,
  ModalHeader,
} from "semantic-ui-react";
import ConfirmCancelModal from "./confirmCancelModal";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import CloseButton from "./closeButton";
import { formatDateTime } from "../util";
import { start } from "repl";
import { forEach } from "lodash";

const options = [
  {
    key: "Cleaning",
    text: "Cleaning",
    value: "Cleaning",
  },
  {
    key: "Checkup",
    text: "Checkup",
    value: "Checkup",
  },
  {
    key: "Filling",
    text: "Filling",
    value: "Filling",
  },
];

const ExistingAppointmentModal = () => {
  const { patients } = useContext(PatientsContext);

  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] =
    React.useState(false);

  const {
    appointments,
    setSelectedAppointment,
    selectedAppointment,
    editAppointment,
    openExistingAppointmentModal,
    setOpenExistingAppointmentModal,
  } = useContext(AppointmentsContext);

  const [client, setClient] = React.useState<Patient | null>(null);

  const formik = useFormik({
    initialValues: {
      start: selectedAppointment?.start || new Date(),
      type: selectedAppointment?.type || "",
    },
    validationSchema: Yup.object({
      start: Yup.date()
        .required("Required")
        .test(
          "conflict-check",
          "This timeslot is already booked",
          function (value) {
            const conflict = appointments.filter(
              (a) =>
                a.id != selectedAppointment?.id &&
                a.staffId === selectedAppointment?.staffId &&
                a.start.toLocaleString() === value.toLocaleString()
            );
            console.log(conflict);
            return !(conflict.length > 0);
          }
        )
        .test(
          "valid-timeslot",
          "Invalid timeslot, please select a time during working days/hours",
          function (value) {
            if (
              value.getHours() < 8 ||
              value.getHours() > 16 ||
              value.getDay() === 0 ||
              value.getDay() === 6 ||
              value.getHours() === 12
            ) {
              return false;
            }
            return true;
          }
        ),
      type: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (selectedAppointment && selectedAppointment.start < new Date()) {
        toast.error("You cannot edit an appointment that has already started");
        setOpenExistingAppointmentModal(false);
        setSelectedAppointment(null);
        return;
      }
      if (selectedAppointment) {
        const updatedAppointment: Appointment = {
          ...selectedAppointment,
          start: values.start,
          end: new Date(values.start.getTime() + 60 * 60 * 1000),
          type: values.type,
          title: `${values.type} with ${client?.name}`,
        };
        editAppointment(selectedAppointment.id, updatedAppointment);
        // setSelectedAppointment(null);
        toast.success("Appointment updated successfully");
        setOpenExistingAppointmentModal(false);
        setSelectedAppointment(null);
      }
    },
  });
  const {
    values,
    resetForm,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  const handleBlur = () => {
    formik.setFieldTouched("start", true, true);
  };

  useEffect(() => {
    if (selectedAppointment) {
      setClient(
        patients.filter((p) => p.id == selectedAppointment.clientId)[0]
      );
    }
  }, [selectedAppointment]);

  const handleClose = () => {
    resetForm();
    setOpenExistingAppointmentModal(false);
  };

  return (
    <div>
      <Modal
        onClose={handleClose}
        onOpen={() => setOpenExistingAppointmentModal(true)}
        open={openExistingAppointmentModal}
      >
        <ModalHeader>
          <div className={"flex justify-between items-center"}>
            <div>
              <FontAwesomeIcon icon={faCalendarCheck} className={"me-2"} />
              Appointment:{" "}
              {selectedAppointment &&
                selectedAppointment.start.toLocaleDateString("en-US", {
                  month: "long", // "long" for full month name.
                  day: "numeric", // "numeric" for the day of the month.
                })}
              ,{" "}
              {selectedAppointment?.start.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              -
              {selectedAppointment?.end.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}{" "}
            </div>
            <CloseButton handleClose={handleClose} />
          </div>
        </ModalHeader>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <div>
              <div className={"flex items-center gap-4"} onBlur={handleBlur}>
                <label className={"text-xl font-semibold"}>Start: </label>
                <DateTimePicker
                  value={values.start}
                  onChange={(value) => {
                    setFieldValue("start", value);
                  }}
                />
              </div>
              {touched.start && errors.start && (
                <p className={"text-red-600"}>{errors.start as string}</p>
              )}
              <div className={"flex items-center gap-4 mt-4"}>
                <label className={"text-xl font-semibold"}>
                  End:{" "}
                  {values.start
                    ? formatDateTime(
                        new Date(values.start.getTime() + 60 * 60 * 1000)
                      )
                    : ""}
                </label>
              </div>
              <div className="inputPair required flex items-center mt-4">
                <label className={"me-2 font-semibold text-xl"}>Type:</label>
                <Dropdown
                  value={values.type}
                  onChange={(e, data) => {
                    setFieldValue("type", data.value as string);
                  }}
                  search
                  selection
                  placeholder="Select a service"
                  fluid
                  options={options}
                />
              </div>
              {errors.type && <p className={"text-red-700"}>{errors.type}*</p>}
              <h3>Patient: {client?.name}</h3>
              <h3>Staff: {selectedAppointment?.staff}</h3>
              <h3>Phone: {client?.phoneNumber}</h3>
              <h3>Email: {client?.email ? client.email : "No data"}</h3>
            </div>
            <div className={"mt-4 flex justify-end gap-3"}>
              <Button
                content="Cancel Appointment"
                labelPosition="right"
                icon="cancel"
                type={"button"}
                onClick={() => {
                  setOpenDeleteConfirmModal(true);
                }}
                negative
              />
              <Button
                content="Save"
                labelPosition="right"
                icon="save"
                type={"submit"}
                positive
              />
            </div>
          </form>
        </ModalContent>
      </Modal>
      <ConfirmCancelModal
        open={openDeleteConfirmModal}
        setOpen={setOpenDeleteConfirmModal}
      />
    </div>
  );
};

export default ExistingAppointmentModal;
