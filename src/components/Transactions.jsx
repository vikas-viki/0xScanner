import React, { useContext } from "react";
import { StateContext } from "../context/Context";

const Transactions = ({ transactions, symbol, explorer }) => {
  const { address } = useContext(StateContext);

  function getTimeElapsed(timestamp) {
    const now = new Date().getTime();
    const timeDiff = (now - timestamp * 1000) / 1000;
    if (timeDiff >= 86400) {
      const days = Math.floor(timeDiff / 86400);
      return days + (days === 1 ? " day" : " days") + " ago";
    } else if (timeDiff >= 3600) {
      const hours = Math.floor(timeDiff / 3600);
      return hours + (hours === 1 ? " hour" : " hours") + " ago";
    } else if (timeDiff >= 60) {
      const minutes = Math.floor(timeDiff / 60);
      return minutes + (minutes === 1 ? " minute" : " minutes") + " ago";
    } else {
      return "Just now";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "15px",
        marginTop: '30px'
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Lato",
          backgroundColor: "#fff",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              fontSize: "17px",
              fontWeight: "600",
              letterSpacing: "1px",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "15px 5px 15px 30px" }}>No.</th>
            <th style={{ padding: "15px 15px 15px 30px" }}>Transaction Hash</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>Block</th>
            <th style={{ padding: "15px 40px 15px 20px" }}>Age</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>From</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>🤔</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>To</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>Value</th>
            <th style={{ padding: "15px 30px 15px 30px" }}>Txn Fee</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((el, i) => {
            return (
              <tr
                key={i}
                style={{
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  padding: "200px",
                  overflow: "hidden",
                  borderBottom: "0.6px solid black",
                }}
              >
                <td style={{ padding: "10px 10px 10px 30px", textAlign: 'center' }}>
                  {transactions.length - i + '.'}
                </td>
                <td style={{ padding: "10px 0px 10px 30px" }}>
                  <a href={`${explorer+el.hash}`} target='_blank' rel="noreferrer" style={{textDecoration: 'none', color: 'blue'}}>
                  {el.hash.slice(0, 15) + "..."}
                  </a>
                </td>
                <td style={{ padding: "10px 30px 10px 30px" }}>{Number(el.blockNumber)}</td>
                <td style={{fontWeight: '600', opacity: '0.9'}}>{getTimeElapsed(el.timeStamp)}</td>
                <td style={{ padding: "10px 30px 10px 30px" }}>
                  {el.from.slice(0, 20) + "..."}
                </td>
                <td
                  style={{
                    padding: "8px 20px 8px 20px" ,
                    alignContent: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      padding: "5px",
                      width: "30px",
                      opacity: "0.85",
                      border: `1px solid ${
                        el.to.includes(address.toLowerCase()) ? "green" : "red"
                      }`,
                      borderRadius: "5px",
                      backgroundColor: `${
                        el.to.includes(address.toLowerCase())
                          ? "#90EE90"
                          : "#FFB6C1"
                      }`,
                      fontWeight: "600",
                    }}
                  >
                    {el.to.includes(address.toLowerCase()) ? "IN" : "OUT"}
                  </span>
                </td>
                <td style={{ padding: "10px 30px 10px 30px" }}>{el.to.slice(0, 20) + "..."}</td>
                <td style={{ padding: "10px 30px 10px 30px", color: '#0062ff', fontWeight: '600', letterSpacing: '0.7px' }}>
                  {(el.value / 10 ** 18).toFixed(4) + " " + symbol}
                </td>
                <td style={{ padding: "10px 30px 10px 30px", opacity: '0.8' }}>
                  {((el.gasPrice * el.gasUsed) / 10 ** 18).toFixed(6)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
