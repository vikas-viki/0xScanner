import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/Context";
import { useParams } from "react-router-dom";
import { Alchemy, Network } from "alchemy-sdk";
import axios from "axios";
import Loader from "../components/Loader";
import Transactions from "../components/Transactions";
import NFTs from "../components/NFTs";
import Tokens from "../components/Tokens";
import Accounts from "./Accounts";

const networks = {
  "eth-mainnet": {
    apiKey: process.env.ETHEREUM_MAINNET_KEY,
    network: Network.ETH_MAINNET,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api.etherscan.io",
    explorer: "https://etherscan.io/tx/",
  },
  "eth-goerli": {
    apiKey: process.env.ETHEREUM_GOERLI_KEY,
    network: Network.ETH_GOERLI,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-goerli.etherscan.io",
    explorer: "https://goerli.etherscan.io/tx/",
  },
  "eth-sepolia": {
    apiKey: process.env.ETHEREUM_SEPOLIA_KEY,
    network: Network.ETH_SEPOLIA,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-sepolia.etherscan.io",
    explorer: "https://sepolia.etherscan.io/tx/",
  },
  "polygon-mainnet": {
    apiKey: process.env.POLYGON_MAINNET_KEY,
    network: Network.MATIC_MAINNET,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api.polygonscan.com",
    explorer: "https://polygonscan.com/tx/",
  },
  "polygon-mumbai": {
    apiKey: process.env.POLYGON_MATIC_KEY,
    network: Network.MATIC_MUMBAI,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api-testnet.polygonscan.com",
    explorer: "https://mumbai.polygonscan.com/tx/",
  },
  "arb-mainnet": {
    apiKey: process.env.ARBITRUM_MAINNET_KEY,
    network: Network.ARB_MAINNET,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api.arbiscan.io",
    explorer: "https://arbiscan.io/tx/",
  },
  "arb-goerli": {
    apiKey: process.env.ARBITRUM_GOERLI_KEY,
    network: Network.ARB_GOERLI,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api-goerli.arbiscan.io",
    explorer: "https://goerli.arbiscan.io/tx/",
  },
  "opt-mainnet": {
    apiKey: process.env.OPTIMISM_MAINNET_KEY,
    network: Network.OPT_MAINNET,
    symbol: "OPT",
    scan: process.env.OPT_SCAN,
    url: "api-optimistic.etherscan.io",
    explorer: "https://optimistic.etherscan.io/tx/",
  },
};

const Details = () => {
  const url = useParams();
  const { address, accountDetails, setAccountDetails } =
    useContext(StateContext);
  const network = networks[url["*"].split("/")[0]];
  const [loading, setLoading] = useState(false);

  const alchemy = new Alchemy({
    apikey: network.apikey,
    network: network.network,
  });

  const formatCurrency = (val) => {
    return (val / 10 ** 18).toFixed(2);
  };

  const [active, setActive] = useState("transactions");

  const fetchData = async () => {
    setLoading(true);
    const networkDetails = networks[url["*"].split("/")[0]];
    const balance = formatCurrency(await alchemy.core.getBalance(url["*"].split("/")[1]));
    const transactions = await axios
      .get(
        `https://${networkDetails.url}/api?module=account&action=txlist&address=${url["*"].split("/")[1]}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${networkDetails.scan}`,
        {}
      )
      .then((data) => {
        return data.data.result
          .filter((el) => el.from.length > 0 && el.to.length > 0)
          .reverse();
      })
      .catch(console.log);

    const nftData = await alchemy.nft.getNftsForOwner(url["*"].split("/")[1]);


    const tokens = await alchemy.core.getTokenBalances(url["*"].split("/")[1]);

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
  };

  useEffect(() => {
    fetchData();
  }, [address]);
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
              Balance{" "}
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
              {accountDetails.balance + ` ${network.symbol}`}
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
              symbol={network.symbol}
              explorer={network.explorer}
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
