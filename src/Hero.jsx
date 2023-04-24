import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "./context/Context";

const Hero = () => {
  
  const { setAddress, setUrl } = useContext(StateContext);
  const [addr, setAddr] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setAddress(addr || "");
  };

  useEffect(()=>{
    setUrl(window.location.pathname);
  })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
      }}
    >
      <h2
        style={{
          fontSize: "2.2rem",
          letterSpacing: "0.8px",
          lineHeight: "30px",
          fontFamily: "Bruno Ace SC",
          marginBottom: "20px",
          color: "#A5D7E8",
        }}
      >
        0xScanner
      </h2>
      { (!window.location.href.includes('details')) && (
        <>
          <span
            style={{
              fontSize: "18.5px",
              letterSpacing: "0.5px",
              fontFamily: "poppins",
              color: "#576CBC",
              textAlign: 'center'
            }}
          >
            Scans you address completely, including your balance, transactions,
            ERC20 tokens, NFTs, and other relevant data, in a standardized
            manner.
          </span>
          <form
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
              alignItems: "center",
              gap: "12px",
              margin: "30px 10px 30px 10px",
              width: "100%",
            }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              id="address"
              style={{
                outline: "none",
                borderRadius: "5px",
                border: "none",
                width: "500px",
                fontSize: "19px",
                padding: "13px",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                fontFamily: "poppins",
              }}
              value={addr}
              onChange={(e) => {
                setAddr(e.target.value);
              }}
              placeholder="Enter address here..."
            />

            <button
              type="submit"
              style={{
                fontSize: "18px",
                padding: "15px 30px 15px 30px",
                color: "#fff",
                fontWeight: "600",
                letterSpacing: "0.8px",
                fontFamily: "poppins",
                backgroundColor: "#576CBC",
                outline: "none",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Scan
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Hero;
