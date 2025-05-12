import React, { useState } from "react";
import Home from "./Home";
import Navbar from "./Navbar";
import Settings from "./Settings";
import AddCategory from "./AddCategory";
import AddCoverLetter from "./AddCoverLetter";

const Extension = () => {
  const [view, setView] = useState("main");
  return (
    <div>
      <Navbar setView={setView} />

      {view === "main" && <Home />}

      {view === "settings" && <Settings setView={setView} />}
      {view === "category" && <AddCategory setView={setView} />}
      {view === "letter" && <AddCoverLetter setView={setView} />}
    </div>
  );
};

export default Extension;
