import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/Context";
import { useParams } from "react-router-dom";
import { Alchemy, Network } from "alchemy-sdk";
import axios from "axios";
import Loader from "../components/Loader";
import Transactions from "../components/Transactions";
import NFTs from "../components/NFTs";
import Tokens from "../components/Tokens";

const networks = {
  "eth-mainnet": {
    apiKey: process.env.ETHEREUM_MAINNET_KEY,
    network: Network.ETH_MAINNET,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api.etherscan.io",
  },
  "eth-goerli": {
    apiKey: process.env.ETHEREUM_GOERLI_KEY,
    network: Network.ETH_GOERLI,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-goerli.etherscan.io",
  },
  "eth-sepolia": {
    apiKey: process.env.ETHEREUM_SEPOLIA_KEY,
    network: Network.ETH_SEPOLIA,
    symbol: "ETH",
    scan: process.env.ETH_SCAN,
    url: "api-sepolia.etherscan.io",
  },
  "polygon-mainnet": {
    apiKey: process.env.POLYGON_MAINNET_KEY,
    network: Network.MATIC_MAINNET,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api.polygonscan.com",
  },
  "polygon-mumbai": {
    apiKey: process.env.POLYGON_MATIC_KEY,
    network: Network.MATIC_MUMBAI,
    symbol: "MATIC",
    scan: process.env.POLYGON_SCAN,
    url: "api-testnet.polygonscan.com",
  },
  "arb-mainnet": {
    apiKey: process.env.ARBITRUM_MAINNET_KEY,
    network: Network.ARB_MAINNET,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api.arbiscan.io",
  },
  "arb-goerli": {
    apiKey: process.env.ARBITRUM_GOERLI_KEY,
    network: Network.ARB_GOERLI,
    symbol: "ETH",
    scan: process.env.ARB_SCAN,
    url: "api-goerli.arbiscan.io",
  },
  "opt-mainnet": {
    apiKey: process.env.OPTIMISM_MAINNET_KEY,
    network: Network.OPT_MAINNET,
    symbol: "OPT",
    scan: process.env.OPT_SCAN,
    url: "api-optimistic.etherscan.io",
  },
};

const Details = () => {
  const { address, accountDetails, setAccountDetails } =
    useContext(StateContext);
  const url = useParams();
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

  const fetchTransaction = async () => {
    setLoading(true);
    const networkDetails = networks[url["*"].split("/")[0]];
    const balance = formatCurrency(await alchemy.core.getBalance(address));
    const transactions = await axios
      .get(
        `https://${networkDetails.url}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${networkDetails.scan}`,
        {}
      )
      .then((data) => {
        return data.data.result;
      })
      .catch(console.log);

    const nftData = await alchemy.nft.getNftsForOwner(address);

    const tokens = await alchemy.core.getTokenBalances(address);

    const tokensMetadata = tokens.tokenBalances.map(async (el) => {
      return await alchemy.core.getTokenMetadata(el.contractAddress);
    });

    await setAccountDetails({ transactions, balance, nftData, tokens });

    console.log({ transactions, balance, nftData, tokens, tokensMetadata });
    setLoading(false);

    setActive("Transactions");
  };

  useEffect(() => {
    fetchTransaction();
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
        <h1
          style={{
            fontSize: '42px',
            fontFamily: 'poppins',
            color: 'cyan',
            letterSpacing: '0.5px',
            opacity: '0.8'
          }}
        >{accountDetails.balance + ` ${network.symbol}`}</h1>
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
            <Transactions transactions={accountDetails.transactions} />
          )}
          {active === "NFTs" && <NFTs nfts={accountDetails.nftData} />}
          {active === "ERC20_Tokens" && (
            <Tokens tokens={accountDetails.tokens} />
          )}
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
