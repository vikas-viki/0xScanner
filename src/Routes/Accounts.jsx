import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/Context";
import { Alchemy } from "alchemy-sdk";
import optimism from "../assets/optimism.svg";
import arbitrum from "../assets/arbitrum.svg";
import polygon from "../assets/polygon.png";
// import solana from "../assets/solana.svg";
import ethereum from "../assets/ethereum.png";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Accounts = ({ need = true }) => {
  const url = useParams();
  console.log({url});
  const { address, APIs, accountsFound, setAccountsFound } =
    useContext(StateContext);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      Promise.all(
        Object.values(APIs).map(async (el) => {
          const al = new Alchemy(el);
          const balance = await al.core.getBalance(
            address.length > 0 ? address :  url["*"].split("/")[1]
          );
          const transactions = await al.core.getTransactionCount(
            address.length > 0 ? address :  url["*"].split("/")[1]
          );
          if (Number(balance) > 0 || transactions > 0) {
            return [el.network, Number(balance), transactions];
          }
        })
      )
        .then((data) => {
          setAccountsFound(
            data.filter((el) => {
              return el !== undefined;
            })
          );
          setLoading(false);
        })
        .catch(console.log);
    };
    if (accountsFound.length <= 0) {
      fetchAccounts();
    }
  }, [address]);

  const formatTitle = (title) => {
    const start =
      title.split("-")[0].slice(0, 1).toUpperCase() +
      title.split("-")[0].slice(1);
    const end =
      title.split("-")[1].slice(0, 1).toUpperCase() +
      title.split("-")[1].slice(1);
    return String(start + " " + end);
  };

  const chainDetails = {
    "eth-mainnet": {
      src: ethereum,
      symbol: "ETH",
    },
    "eth-goerli": {
      src: ethereum,
      symbol: "ETH",
    },
    "eth-sepolia": {
      src: ethereum,
      symbol: "ETH",
    },
    "opt-mainnet": {
      src: optimism,
      symbol: "OPT",
    },
    "polygon-mainnet": {
      src: polygon,
      symbol: "MATIC",
    },
    "polygon-mumbai": {
      src: polygon,
      symbol: "MATIC",
    },
    "arb-mainnet": {
      src: arbitrum,
      symbol: "ETH",
    },
    "arb-goerli": {
      src: arbitrum,
      symbol: "ETH",
    },
  };

  const formatCurrency = (val) => {
    return (val / 10 ** 18).toFixed(2);
  };

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
                      navigate(`/${el[0]}/${address}`);
                      need === false && window.location.reload();
                    }}
                  >
                    <img
                      src={chainDetails[el[0]].src}
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
                              chainDetails[el[0]].symbol}
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
