import React from "react";
import def_token from "../assets/def_token.png";
const BigNumber = require('bignumber.js');

const Tokens = ({ tokens, tokensMetadata }) => {



  function getToken(tokenBalance, decimals) {
    const balanceBN = new BigNumber(tokenBalance);
    const decimalsBN = new BigNumber(10).exponentiatedBy(decimals);
    const balance = balanceBN.dividedBy(decimalsBN).toFixed(decimals);
    return balance;
  }
  
  return (
    <>
    <span
        style={{
          fontSize: "20px",
          fontFamily: "poppins",
          color: "#fff",
          justifySelf: "flex-end",
          width: "100%",
          textAlign: "right",
          maxWidth: '1100px'
        }}
      >
        Total:{" "}
        {tokensMetadata.length === 100
          ? tokensMetadata.length + "+"
          : tokensMetadata.length}
      </span>
    
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "45px",
        marginTop: "30px",
        flexWrap: 'wrap'
      }}
    >
      {tokensMetadata.map((el, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: "lightgray",
              borderRadius: "5px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={el.logo || def_token}
              alt="@"
              width="150"
              height="150"
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                letterSpacing: "0.7px",
                fontFamily: "poppins",
                minWidth: '300px',
                textAlign: 'center'
              }}
            >
              { el.symbol}<br />
              {getToken(tokens.tokenBalances[i].tokenBalance, el.decimals)}
            </span>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default Tokens;
