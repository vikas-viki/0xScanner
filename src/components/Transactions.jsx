import React, { useContext } from "react";
import { StateContext } from "../context/Context";

const Transactions = ({ transactions }) => {
  const { address } = useContext(StateContext);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      {transactions.map((el, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span>From: {el.from}</span>
            <span>To: {el.to}</span>
            <span>{el.from === address ? "OUT" : "IN"}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Transactions;
