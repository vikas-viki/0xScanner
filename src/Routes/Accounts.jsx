import React, { useContext, useEffect } from "react";
import { StateContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Accounts = ({ need = true }) => {
  const {
    address,
    APIs,
    accountsFound,
    fetchAccounts,
    formatCurrency,
    setAlchemyAPIkey,
    formatTitle,
    loading,
    setAddress
  } = useContext(StateContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (accountsFound.length <= 0) {
      fetchAccounts();
    }
  }, [address]);

  return (
    <div
      style={{
        margin: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {address.length > 0 ? (
        <div
          style={{
            margin: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "35px",
            alignItems: "center",
            fontFamily: "poppins",
            width: "100%",
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              {need && (
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "lightcyan",
                    opacity: "0.7",
                    letterSpacing: "0.2px",
                    wordSpacing: "1px",
                    lineHeight: "40px",
                  }}
                >
                  Multichain address found
                </span>
              )}
              {accountsFound.map((el, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      padding: "20px",
                      borderRadius: "5px",
                      backgroundColor: "#61A6F6",
                      opacity: "0.93",
                      display: "flex",
                      width: "85%",
                      gap: "15px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      cursor: "pointer",
                      boxShadow:
                        "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    }}
                    onClick={() => {
                      navigate(`/details`);
                      setAlchemyAPIkey(APIs[`${el[0]}`]);
                      setAddress(el[3]);
                    }}
                  >
                    <img
                      src={APIs[el[0]].src}
                      style={{
                        border: `${
                          el[0].includes("mainnet") ? "1px" : "2px"
                        }  ${
                          el[0].includes("mainnet") ? "solid" : "dotted"
                        } black`,
                        borderRadius: "50%",
                        padding: "3px",
                        borderSpacing: "40px",
                      }}
                      alt="@"
                      width="50"
                      height="50"
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: "600",
                          marginBottom: "10px",
                          wordSpacing: "5px",
                          lineHeight: "30px",
                          opacity: "0.95",
                        }}
                      >
                        {formatTitle(el[0])}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "30px",
                        }}
                      >
                        <span>
                          Found by address:{" "}
                          <span style={{ fontWeight: "500" }}>{address}</span>
                        </span>
                        <span>
                          Transactions:{" "}
                          <span style={{ fontWeight: "500" }}>{el[2]}</span>
                        </span>
                        <span>
                          Balance:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {formatCurrency(el[1]) +
                              " " +
                              APIs[el[0]].symbol}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            fontSize: "17px",
            opacity: "0.5",
            marginTop: "70px",
            fontWeight: "500",
            letterSpacing: "0.6px",
            fontFamily: "poppins",
            color: "white",
          }}
        >
          Enter address to see the details..
        </div>
      )}
    </div>
  );
};

export default Accounts;
