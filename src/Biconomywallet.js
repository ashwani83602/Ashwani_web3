import React from "react";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import Biconomy_Abi from "./ABI/Biconomy_Abi.json";
import { useState } from "react";
let abi = require("ethereumjs-abi");
const ethUtils = require("ethereumjs-util");


const Biconomywallet = () => {

  const { ethereum } = window;
  const [showAddress, setAddress] = useState(null);

  const provider = new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-2-s2.binance.org:8545/"
  );

  const biconomy = new Biconomy(provider, {
    walletProvider: provider,
    apiKey: "RPjYCzn7x.bd1bb4e0-1a9f-412f-873a-57660c16c646",
    debug: false,
    contractAddresses: ["0x1D6130DEc852cb5876418655b0F98bAe9A34FA33"],
  });  

  const web3 = new Web3(biconomy);

  let contractAddress = "0x1D6130DEc852cb5876418655b0F98bAe9A34FA33";

  const constructMetaTransactionMessage = (
    nonce,
    chainId,
    functionSignature,
    contractAddress
  ) => {
    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, ethUtils.toBuffer(functionSignature)]
    );
  };

  const getSignatureParameters = (signature) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v,
    };
  };

  let accounts;
  const connectWallet = async () => {
      if(window.ethereum){
          accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("accounts", accounts);
          setAddress(accounts[0]);
      } else {
        alert("install metamask extension!!");
      }

      if (window.ethereum) {
        try {
          const res = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
         setAddress(res[0]);

        } catch (err) {
          console.error(err);
          alert("There was a problem connecting to MetaMask");
        }
      } else {
        alert("Install MetaMask");
      }
  };

  const transfer = async (e) => {
      e.preventDefault();
    console.log("transfer function");

    biconomy.onEvent(biconomy.READY, async () => {
      console.log("biconomy connected!!");
    });

    let recieverAddress = e.target.recieverAddress.value;
    let transferAmount = e.target.sendAmount.value*10**18;
    let tranfer_amt = transferAmount.toString()

    console.log(contractAddress);
    const contractInstance = new web3.eth.Contract(Biconomy_Abi, contractAddress);
    let nonce = await contractInstance.methods.getNonce(showAddress).call();
    // let functionSignature = contractInstance.methods
    //   .transfer("0x875CcB19748c7B68Bad7C73D4a8FFdCE2507Ed6a", 420)
    //   .encodeABI();
      let functionSignature = contractInstance.methods
      .transfer(recieverAddress, tranfer_amt)
      .encodeABI();
    let chainId = 97;
    //same helper constructMetaTransactionMessage used in SDK front end code
    console.log("===================here=======================");
    let messageToSign = constructMetaTransactionMessage(
      nonce,
      chainId,
      functionSignature,
      contractAddress
    );
    console.log("===================here=======================");

    let { signature } = web3.eth.accounts.sign(
      "0x" + messageToSign.toString("hex"),
      `0x${privateKey}`
    );
    let { r, s, v } = getSignatureParameters(signature); // same helper used in SDK frontend code

    let estimatedGas = await contractInstance.methods
      .executeMetaTransaction(showAddress, functionSignature, r, s, v)
      .estimateGas({ from: showAddress });
    console.log("estimatedGas---->>>>>", estimatedGas);

    let executeMetaTransactionData = contractInstance.methods
      .executeMetaTransaction(showAddress, functionSignature, r, s, v)
      .encodeABI();

    web3.eth.getGasPrice().then(console.log);

    let txParams = {
      from: showAddress,
      to: contractAddress,
      value: "0x0",
      gas: "10000000", // (optional) your custom gas limit
      data: executeMetaTransactionData,
    };
    const signedTx = await web3.eth.accounts.signTransaction(
      txParams,
      `0x${privateKey}`
    );
    console.log("=================signed===================");
    console.log(signedTx);
    try {
      console.log("adsfsadfsafdsadfsafd");

      let receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        (error, txHash) => {
          if (error) {
            // return console.error(error);
            console.log("=================error===================");
            console.log(error);
          }
          console.log("Transaction hash is ", txHash);
          // do something with transaction hash
        }
      );

      console.log(receipt.transactionHash);
      console.log("=================completed===================");
    } catch (error) {
      console.log("error aa gayi =========");
      console.log(error);
    }

  
  };

  let privateKey =
    "f5c66237644c26704733fb9940507fce03e7ccb99b6bbd064c9b2a55b2601990";

  return (
    <div>
      <h1>Biconomy</h1>
      <button onClick={connectWallet}>Connect</button>
      <p>{showAddress}</p>

      <form onSubmit={transfer}>
			<p> Reciever Address </p>
			<input type='text' id='recieverAddress'/>

			<p> Send Amount </p>
			<input type='text' id='sendAmount' />

			<button type='submit' >Send</button>
		</form>

    </div>
  );
};

export default Biconomywallet;
