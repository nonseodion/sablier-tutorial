import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from '@web3-react/core'
import "./index.css";
import App from "./App";

// This is the official Sablier v1 subgraph. You can replace it with your own, if you need to.
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
});

function getLibrary(provider) {
  const library = new Provider.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Web3ReactProvider>,
  document.getElementById("root"),
);
