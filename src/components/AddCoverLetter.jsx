import React from "react";
import Title from "./Title";

const AddCoverLetter = ({ setView }) => {
  console.log("setView", setView);
  return (
    <div>
     <Title setView={setView} title="Add CoverLetter" />


    </div>
  );
};

export default AddCoverLetter;
