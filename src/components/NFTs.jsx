import React from "react";
import def_nft from "../assets/def_nft.png";

const NFTs = ({ nfts }) => {
  
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
        {nfts.ownedNfts.length === 100
          ? nfts.ownedNfts.length + "+"
          : nfts.ownedNfts.length}
      </span>
      <div
        style={{
          display: "flex",
          marginTop: "70px",
          gap: "70px",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {nfts.ownedNfts.length > 0 ? (
          nfts.ownedNfts.map((el, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  maxWidth: "1000px",
                  wordBreak: "break-word",
                  backgroundColor: "#61A6F6",
                  padding: "20px",
                  borderRadius: "5px",
                  fontFamily: "poppins",
                }}
                className="nft"
              >
                <img
                  src={el.media[0].thumbnail || el.rawMetadata.image || def_nft}
                  alt="@"
                  width="200"
                  height="200"
                  onError={(e) => {
                    e.target.src = def_nft;
                  }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  "{el.rawMetadata.name}"
                </span>
                <span style={{ wordWrap: "break-word" }}>
                  {el.description.slice(0, 200) +
                    (el.description.slice(0, 200).length > 199 ? "..." : " ")}
                </span>
              </div>
            );
          })
        ) : (
          <span
            style={{
              marginTop: "80px",
              fontSize: "18px",
              fontWeight: "600",
              color: "lightcyan",
              opacity: "0.7",
              letterSpacing: "0.2px",
              wordSpacing: "1px",
            }}
          >
            Address provided doesn't hold any NFTs.
          </span>
        )}
      </div>
    </>
  );
};

export default NFTs;
