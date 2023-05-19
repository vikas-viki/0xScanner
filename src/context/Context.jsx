import React, { createContext, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useParams } from "react-router-dom";
import optimism from "../assets/optimism.svg";
import arbitrum from "../assets/arbitrum.svg";
import polygon from "../assets/polygon.png";
import ethereum from "../assets/ethereum.png";
// import solana from "../assets/solana.svg";
import axios from "axios";

export const StateContext = createContext();

const APIs = {
  "eth-mainnet": {
    apiKey: process.env.ETHEREUM_MAINNET_KEY, // alchemy api key, for fetching data.
    network: Network.ETH_MAINNET, // network specification for fetching data.
    symbol: "ETH", // Symbol of the network.
    scan: process.env.ETH_SCAN, // API key for transactions fetching like etherscan and all.
    url: "api.etherscan.io", // URL for fetching transactions.
    explorer: "https://etherscan.io/tx/", // URL for redirecting user to redirect to transactions.
    src: ethereum, // image of the network.
  },
  "eth-goerli": {
    apiKey: process.env.ETHEREUM_GOERLI_KEY,
    network: Network.ETH_GOERLI,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-goerli.etherscan.io",
    explorer: "https://goerli.etherscan.io/tx/",
    src: ethereum,
  },
  "eth-sepolia": {
    apiKey: process.env.ETHEREUM_SEPOLIA_KEY,
    network: Network.ETH_SEPOLIA,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-sepolia.etherscan.io",
    explorer: "https://sepolia.etherscan.io/tx/",
    src: ethereum,
  },
  "polygon-mainnet": {
    apiKey: process.env.POLYGON_MAINNET_KEY,
    network: Network.MATIC_MAINNET,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api.polygonscan.com",
    explorer: "https://polygonscan.com/tx/",
    src: polygon,
  },
  "polygon-mumbai": {
    apiKey: process.env.POLYGON_MATIC_KEY,
    network: Network.MATIC_MUMBAI,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api-testnet.polygonscan.com",
    explorer: "https://mumbai.polygonscan.com/tx/",
    src: polygon,
  },
  "arb-mainnet": {
    apiKey: process.env.ARBITRUM_MAINNET_KEY,
    network: Network.ARB_MAINNET,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api.arbiscan.io",
    explorer: "https://arbiscan.io/tx/",
    src: arbitrum,
  },
  "arb-goerli": {
    apiKey: process.env.ARBITRUM_GOERLI_KEY,
    network: Network.ARB_GOERLI,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api-goerli.arbiscan.io",
    explorer: "https://goerli.arbiscan.io/tx/",
    src: arbitrum,
  },
  "opt-mainnet": {
    apiKey: process.env.OPTIMISM_MAINNET_KEY,
    network: Network.OPT_MAINNET,
    symbol: "OPT",
    scan: process.env.OPT_SCAN,
    url: "api-optimistic.etherscan.io",
    explorer: "https://optimistic.etherscan.io/tx/",
    src: optimism,
  },
};

const Context = ({ children }) => {
  const [alchemyAPIkey, setAlchemyAPIkey] = useState(APIs["eth-mainnet"]);
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState(useParams());
  const alchemy = new Alchemy({
    apikey: alchemyAPIkey.apiKey,
    network: alchemyAPIkey.network,
  });
  const [accountsFound, setAccountsFound] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [active, setActive] = useState("transactions");
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val) => {
    return (val / 10 ** 18).toFixed(2);
  };

  const formatTitle = (title) => {
    const start =
      title.split("-")[0].slice(0, 1).toUpperCase() +
      title.split("-")[0].slice(1);
    const end =
      title.split("-")[1].slice(0, 1).toUpperCase() +
      title.split("-")[1].slice(1);
    return String(start + " " + end);
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      Promise.all(
        Object.values(APIs).map(async (el) => {
          const settings = {
            apikey: el.apiKey,
            network: el.network,
          };
          const al = new Alchemy(settings);
          const balance = await al.core.getBalance(address);
          const transactions = await al.core.getTransactionCount(address);
          if (Number(balance) > 0 || transactions > 0) {
            return [el.network, Number(balance), transactions, address];
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
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const balance = formatCurrency(await alchemy.core.getBalance(address));
      const transactions = await axios
        .get(
          `https://${alchemyAPIkey.url}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${alchemyAPIkey.scan}`,
          {}
        )
        .then((data) => {
          return data.data.result
            .filter((el) => el.from.length > 0 && el.to.length > 0)
            .reverse();
        })
        .catch(console.log);

      const nftData = await alchemy.nft.getNftsForOwner(address);

      const tokens = await alchemy.core.getTokenBalances(address);

      const tokensMetadata = [];
      await tokens.tokenBalances.map(async (el) => {
        alchemy.core
          .getTokenMetadata(el.contractAddress)
          .then((data) => {
            tokensMetadata.push(data);
          })
          .catch(console.log);
      });

      await setAccountDetails({
        transactions,
        balance,
        nftData,
        tokens,
        tokensMetadata,
      });

      setLoading(false);

      setActive("Transactions");
    } catch (e) {
      console.log(e);
    }
  };

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
        active,
        setActive,
        loading,
        setLoading,
        formatCurrency,
        formatTitle,
        fetchAccounts,
        fetchData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default Context;
