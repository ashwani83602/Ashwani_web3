// import { BscConnector } from '@binance-chain/bsc-connector';
import React from 'react'
import { useState } from 'react';
import Web3 from 'web3';
// import { fu } from './Abstraction';

const BinanceWallet = () => {
    const [isConnected, setIsConnected] = useState("Connect Wallet");
    const [walletAddress, setWalletAddress] = useState("");
    const [accountId, setAccountId] = useState("");
    let web3;
    const { BinanceChain, ethereum } = window;
    web3 = new Web3(ethereum);

    let currentChainId = BinanceChain.chainId;
    console.log("currentChainId>>>>",currentChainId);

    BinanceChain.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
        window.location.reload();
    }

    const connectWallet = async() => {
        let gg;
        await BinanceChain
        .request({ method: 'eth_requestAccounts' }).then(
            (res) => {
               
                gg=res[0]
                setWalletAddress(res[0])
                setIsConnected("Wallet Connected")
            })
     
           console.log( BinanceChain.isConnected());
           console.log( BinanceChain);


           await BinanceChain.requestAccounts().then((res) => {
            console.log("ttttttttttttttttttttttttttttttt",res[0].id)
            console.log(res[0])
            setAccountId(res[0].id)
        })

       await BinanceChain.request({
            method:'eth_getBalance' ,
            params: [gg, "latest"]
        }).then(
                (res) => {
                    console.log("ffffffffffffffffffffffff",res/10**18)
                })

        //  BinanceChain.request({ method: 'eth_getBalance' ,params: gg }).then((res)=>{console.log(res)})

        
    }

    const transferBNB = async(e) => {
        if(isConnected == "Wallet Connected"){

            e.preventDefault();
    
            let transferAmount = e.target.sendAmount.value;
            console.log("transferAmount",transferAmount)
            // let tranfer_amt = transferAmount.toString()
            // console.log("transferAmount:",tranfer_amt);
    
            let recieverAddress = e.target.recieverAddress.value;
console.log("kkkkkkkkkkkkkkkkkkk",walletAddress);

        //    await BinanceChain.request({method: 'eth_sendTransaction',
        //     params: [
        //         {
        //           from: walletAddress,
        //           to: recieverAddress,
        //           gas: "0x76c0", // 30400
        //           gasPrice: "0x9184e72a000", // 10000000000000
        //           value: transferAmount, // 2441406250
        //           data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        //         },
        //       ]
        //     })
        //     .then((res) => {
        //         console.log(res)
           
            BinanceChain.transfer({
                fromAddress: walletAddress,  
                toAddress: recieverAddress, 
                asset: "BNB", 
                amount: transferAmount, 
                accountId: accountId,
                networkId: "bbc-testnet", 
                })
        }
        else {
            alert("Please Connect Wallet First")
        }
    }

  return (
    <div>
        <h4>---------------BinanceWallet Connection----------</h4>
        <button onClick={connectWallet}>{isConnected}</button>
        <h4>Wallet Address : {walletAddress}</h4>
        {/* <button onClick={fu}>Web3</button> */}
        <br/><br/>

        <form onSubmit={transferBNB}>
			<p> Reciever Address </p>
			<input type='text' id='recieverAddress'/>

			<p> Send Amount </p>
			<input type='text' id='sendAmount' />

			<button type='submit' >Send</button>
            {/* { <h4>Hash : {hash}</h4> } */}
		</form>
    </div>
  )
}

export default BinanceWallet
