import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <button
      className="hover:bg-gray-500 rounded-full w-[32px] h-[32px]"
      onClick={handleClose}
    >
      <FontAwesomeIcon icon={faXmark} size={"xl"} />
    </button>
  );
};

export default CloseButton;
