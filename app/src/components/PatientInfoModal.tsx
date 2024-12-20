import React, { Dispatch, useContext, useState } from "react";
import {
  ModalHeader,
  ModalContent,
  ModalActions,
  Modal,
  Button,
  Input,
} from "semantic-ui-react";
import { PatientsContext } from "../contexts/patientsContext";
import "../styles/PatientInfoModal.scss";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospitalUser,
  faUserPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import PatientEditForm from "./PatientEditForm";
import CloseButton from "./closeButton";
import { formatPhoneNumber } from "../util";

const PatientInfoModal = () => {
  const { selectedPatient, setSelectedPatient, editPatient, setEditPatient } =
    useContext(PatientsContext);

  const handleClose = () => {
    setSelectedPatient(null);
    setEditPatient(false);
  };

  return (
    <div>
      <Modal
        dimmer={"blurring"}
        open={selectedPatient !== null}
        onClose={handleClose}
      >
        <ModalHeader>
          <div className={"modal-header"}>
            <div className={"text-3xl"}>
              {editPatient ? (
                <FontAwesomeIcon icon={faUserPen} className={"me-2"} />
              ) : (
                <FontAwesomeIcon icon={faHospitalUser} className={"me-2"} />
              )}
              {editPatient ? "Edit Patient Info" : "Patient Info"}
            </div>
            <CloseButton handleClose={handleClose} />
          </div>
        </ModalHeader>
        <ModalContent className="modal-content">
          {editPatient ? (
            <PatientEditForm />
          ) : (
            <div>
              <div className="two-items-row">
                <p className="info-entry">Name: {selectedPatient?.name}</p>
                {/*<p className="info-entry">Gender: {selectedPatient?.gender}</p>*/}
              </div>
              <div className="two-items-row">
                <p className="info-entry">
                  Phone Number:{" "}
                  {formatPhoneNumber(selectedPatient?.phoneNumber || "")}
                </p>
                {/*<p className="info-entry">*/}
                {/*  Birthdate: {moment(selectedPatient?.dob).format("MM/DD/YYYY")}*/}
                {/*</p>*/}
              </div>
              {/*<div className="row">*/}
              {/*  <p className="info-entry">*/}
              {/*    Address: {selectedPatient?.address}*/}
              {/*  </p>*/}
              {/*</div>*/}
              <div className="row">
                <p className="info-entry">
                  Email:{" "}
                  {selectedPatient?.email ? selectedPatient?.email : "No data"}
                </p>
              </div>
              <div className="row">
                <p className="info-entry">
                  Date Created:{" "}
                  {moment(selectedPatient?.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
              <div className="row">
                <p className="info-entry">
                  Notes:{" "}
                  {selectedPatient?.notes ? selectedPatient?.notes : "None"}
                </p>
              </div>
            </div>
          )}
        </ModalContent>
        <ModalActions>
          {!editPatient && (
            <div>
              <Button
                content={"Edit"}
                positive
                onClick={() => setEditPatient(true)}
                labelPosition="right"
                icon="edit"
              />
            </div>
          )}
        </ModalActions>
      </Modal>
    </div>
  );
};

export default PatientInfoModal;
