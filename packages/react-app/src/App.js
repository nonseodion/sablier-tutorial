import React, { useCallback, useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";
import { useWeb3React } from '@web3-react/core';
import DateTimePicker from 'react-datetime-picker';

import { Body, Button, Header, /*Image, Link*/ } from "./components";
import { web3Modal, logoutOfWeb3Modal } from './utils/web3Modal'

import { MAINNET_ID, addresses, abis } from "@sablier-v1-app/contracts";
import GET_STREAMS from "./graphql/subgraph";

import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 30 });

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const sablierContract = new Contract(addresses[MAINNET_ID].sablier, abis.sablier, defaultProvider);
  const nextStreamId = await sablierContract.nextStreamId();
  console.log({ nextStreamId: nextStreamId.toString() });
}

function WalletButton({ provider, loadWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

// function showAddress(){

// }

// createStream = () => {
//   const sablier = new ethers.Contract(addresses[chainId].sablier, abis.sablier, getProviderOrSigner(library, account))
// }

function App() {
  const { loading, error, data } = useQuery(GET_STREAMS);
  const [provider, setProvider] = useState();
  const [value1, onChange1] = useState(new Date());
  const [value2, onChange2] = useState(new Date());

  const web3React = useWeb3React();
  console.log(web3React);

  /* Open wallet selection modal. */
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, []);

  /* If user has loaded a wallet before, load it automatically. */
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  React.useEffect(() => {
    if (!loading && !error && data && data.streams) {
      console.log({ streams: data.streams });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
      </Header>
      <Body>
        <h1>Let's Create a Payment Stream</h1>
        <p>Wallet Connected: </p>
        <input placeholder="Enter Deposit Amount"/>
        <input placeholder="Recipient Address"/>
        <label for="start">Start Time</label>
        <DateTimePicker 
          onChange={onChange1} 
          value={value1}/>
        <label for="stop">Stop Time</label>
        <DateTimePicker 
          onChange={onChange2} 
          value={value2}/>
        <Button>
          Create Stream
        </Button>
      </Body>
    </div>
  );
}

export default App;
