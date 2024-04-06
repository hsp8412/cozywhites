import React, { useContext, useState } from "react";
import SearchBar from "./searchBar";
import { PatientsContext } from "../../contexts/patientsContext";
import { formatPhoneNumber } from "../../util";

const PatientsTab = () => {
  const { patients, setSelectedPatient } = useContext(PatientsContext);
  const [searchTerm, setSearchTerm] = useState("");

  let filteredPatients = patients;
  if (searchTerm !== "") {
    filteredPatients = patients.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phoneNumber.includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  let sorted = filteredPatients.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center py-5 w-full flex-grow overflow-hidden">
      <p className={"text-gray-600 font-bold"}>
        Instructions: select a patient to check his/her info.
      </p>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {sorted.length > 0 ? (
        <div className="flex flex-col items-center gap-10 mt-4 pt-4 pb-4 w-full overflow-y-auto flex-grow">
          {sorted.map((patient, index) => {
            return (
              <div
                key={index}
                className="w-9/12 flex flex-col justify-center items-center py-7 shadow-xl rounded bg-tertiary hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedPatient(patient);
                }}
              >
                <h1 className={"text-center"}> {patient.name} </h1>
                <p className={"text-center"}>
                  <strong>Phone Number:</strong>{" "}
                  {formatPhoneNumber(patient.phoneNumber)}
                </p>
                <p className={"text-center"}>
                  <strong>Email:</strong>{" "}
                  {patient.email ? patient.email : "No data"}
                </p>
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

export default PatientsTab;
