import { useState } from "react";
import "./styles/index.scss";

const Component = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <h1>React application</h1>
      <button
        style={{
          all: "unset",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => setClicked((b) => !b)}
      >
        {clicked ? "clicked" : "not clicked"}
      </button>
    </>
  );
};

export default Component;
