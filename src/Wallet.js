// import {useState} from 'react';

// export const Wallet = () => {

//    const [address, setAddress] = useState('')
//   const requestAccount = async () =>{
//     // check metamask install or not
//     if(window.ethereum){
//       console.log("detected")
//     }
//     else{
//       console.log("not detected");
//     }
//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts"
//       })
//       console.log("account",accounts);
//       setAddress(accounts)
//     } catch (error) {
      
//     }

//   }
//   // const connectWallet = async () =>{
//   //   if(typeof window.ethereum !== 'undefined'){
//   //     await requestAccount();
//   //     const provider = new ethers.providers.web
//   //   }
//   // }
//   return (
//     <div>wallet- connectoion
//       <div>
//         <button onClick={requestAccount}>Request accounts</button>
//         {/* <button onClick={connectWallet}>connect wallet</button> */}

//         <h2>wallet address: {address}</h2>
//       </div>
//     </div>
//   )
// }

import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import simple_token_abi from './Contracts/simple_token_abi.json'
import Interactions from './Interaction';
import { BigNumber } from "bignumber.js";

export const Wallet = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0xb6e7bfae8de8917f6abcaa5d691cff407e9ef54a';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tokenName, setTokenName] = useState("Token");
	const [balance, setBalance] = useState(null);
	const [transferHash, setTransferHash] = useState(null);



	const connectWalletHandler = () => {
		
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}
	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, simple_token_abi,tempSigner);
		setContract(tempContract);	
	}

	

	const updateBalance = async () => {
		
		let balanceBigN = await contract.balanceOf(defaultAccount);
		console.log("bbbbbbbbbb",balanceBigN);

		const value = BigNumber(balanceBigN).toFixed();
		console.log("bbbbbbbbbb",value);

		let balanceNumber = balanceBigN.toNumber();

		let tokenDecimals = await contract.decimals();

		let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

		setBalance(toFixed(tokenBalance));	


	}

	useEffect(() => {
		console.log("contract",contract);
		if (contract != null) {
			updateBalance();
			updateTokenName();
		}
	}, [contract]);
 
	const updateTokenName = async () => {
		setTokenName(await contract.name());
	}
	
   function toFixed(x) {
   if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
         x *= Math.pow(10, e - 1);
         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
   } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
         e -= 20;
         x /= Math.pow(10, e);
         x += (new Array(e + 1)).join('0');
      }
   }
   return x;
}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	

	

	return (
	<div>
			<h2> {tokenName + " ERC-20 Wallet"} </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			<div className={styles.walletCard}>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>

			<div>
				<h3>{tokenName} Balance: {balance}</h3>
			</div>

			{errorMessage}
		</div>
		<Interactions contract = {contract}/>
	</div>
	)
}

//export default Wallet;
