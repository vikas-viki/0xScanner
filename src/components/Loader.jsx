import React from "react";

const Loader = () => {
  return (
    <>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <span
        style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "lightcyan",
          opacity: "0.7",
          letterSpacing: "0.2px",
          wordSpacing: "1px",
        }}
      >
        Loading details...
      </span>
    </>
  );
};

export default Loader;
