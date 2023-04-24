import React, { useContext, useEffect } from "react";
import { StateContext } from "../context/Context";
import Loader from "../components/Loader";
import Transactions from "../components/Transactions";
import NFTs from "../components/NFTs";
import Tokens from "../components/Tokens";
import Accounts from "./Accounts";



const Details = () => {
  const { address, accountDetails, active, setActive, loading, fetchData, alchemyAPIkey, formatTitle } =
    useContext(StateContext);

  useEffect(() => {
    fetchData();
    console.log("called fetchData() ")
  }, [alchemyAPIkey || address]);
  return (
    <div
      style={{
        display: " flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "25px",
        margin: "60px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "lightgray",
                fontFamily: "poppins",
                letterSpacing: "0.5px",
                opacity: "0.8",
              }}
            >
              Balance: {` ${formatTitle(alchemyAPIkey.network)}`}
            </span>
            <h1
              style={{
                fontSize: "42px",
                color: "cyan",
                marginTop: "5px",
                fontFamily: "poppins",
                letterSpacing: "0.5px",
                opacity: "0.8",
              }}
            >
              {accountDetails.balance + ` ${alchemyAPIkey.symbol}`}
            </h1>
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, #2377B4 100%)",
              borderRadius: "10px",
              gap: "60px",
              paddingBottom: "20px",
              borderBottom: "2px solid lightgray",
              width: "100%",
              flexWrap: 'wrap',
              maxWidth: '1100px'
            }}
          >
            <span
              style={btnStyle}
              onClick={() => {
                setActive("Transactions");
              }}
            >
              Transactions
            </span>
            <span
              style={btnStyle}
              onClick={() => {
                setActive("ERC20_Tokens");
              }}
            >
              ERC20 Tokens
            </span>
            <span
              style={btnStyle}
              onClick={() => {
                setActive("NFTs");
              }}
            >
              NFTs
            </span>
            <span
              style={btnStyle}
              onClick={() => {
                setActive("Multichain_Address");
              }}
            >
              Multichain Address
            </span>
          </div>
          {active === "Transactions" && (
            <Transactions
              transactions={accountDetails.transactions}
              symbol={alchemyAPIkey.symbol}
              explorer={alchemyAPIkey.explorer}
            />
          )}
          {active === "NFTs" && <NFTs nfts={accountDetails.nftData} />}
          {active === "ERC20_Tokens" && (
            <Tokens
              tokens={accountDetails.tokens}
              tokensMetadata={accountDetails.tokensMetadata}
            />
          )}
          {active === "Multichain_Address" && <Accounts need={false} />}
        </>
      )}
    </div>
  );
};

export default Details;
const btnStyle = {
  fontSize: "18px",
  backgroundColor: "#A5D7E8",
  minWidth: "150px",
  textAlign: "center",
  borderRadius: "5px",
  padding: "7px",
  cursor: "pointer",
  fontFamily: "poppins",
  fontWeight: "500",
  opacity: "0.9",
  border: "3px solid #A5D7E8",
};
