import React, { createContext, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useParams } from "react-router-dom";

export const StateContext = createContext();

const APIs = {
  ETH_MAINNET: {
    apiKey: process.env.ETHEREUM_MAINNET_KEY,
    network: Network.ETH_MAINNET,
  },
  ETH_GOERLI: {
    apiKey: process.env.ETHEREUM_GOERLI_KEY,
    network: Network.ETH_GOERLI,
  },
  ETH_SEPOLIA: {
    apiKey: process.env.ETHEREUM_SEPOLIA_KEY,
    network: Network.ETH_SEPOLIA,
  },
  POLYGON_MAINNET: {
    apiKey: process.env.POLYGON_MAINNET_KEY,
    network: Network.MATIC_MAINNET,
  },
  POLYGON_MATIC: {
    apiKey: process.env.POLYGON_MATIC_KEY,
    network: Network.MATIC_MUMBAI,
  },
  ARBITRUM_MAINNET: {
    apiKey: process.env.ARBITRUM_MAINNET_KEY,
    network: Network.ARB_MAINNET,
  },
  ARBITRUM_GOERLI: {
    apiKey: process.env.ARBITRUM_GOERLI_KEY,
    network: Network.ARB_GOERLI,
  },
  OPTIMISM_MAINNET: {
    apiKey: process.env.OPTIMISM_MAINNET_KEY,
    network: Network.OPT_MAINNET,
  },
};

const Context = ({ children }) => {
  const [alchemyAPIkey, setAlchemyAPIkey] = useState(APIs.ETH_MAINNET);
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState(useParams());
  const alchemy = new Alchemy(alchemyAPIkey);
  const [accountsFound, setAccountsFound] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});

  return (
    <StateContext.Provider
      value={{
        address,
        setAddress,
        setAlchemyAPIkey,
        alchemyAPIkey,
        APIs,
        alchemy,
        accountDetails,
        setAccountDetails,
        url,
        setUrl,
        accountsFound,
        setAccountsFound,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default Context;
