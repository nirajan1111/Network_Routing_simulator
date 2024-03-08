import React, { useState } from "react";
import { useMyContext } from "../../Context/ContextProvider";
const PopupAlert = ({content}:any) => {

    const { isOpen, togglePopup } :any= useMyContext();
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {isOpen && (
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Alert</h2>
          <p>{content}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={togglePopup}
          >
            Close
          </button>
        </div>
      )}
     
    </div>
  );
};

export default PopupAlert;
