import React, { useEffect, useState } from "react";
import Web3 from "web3";
import TokenAbi from "../src/ABI/Token_Abi.json";
import TokenAbi2 from "../src/ABI/Token_Ab2.json";

function Walletweb3() {
  let web3;
  const { ethereum } = window;
  web3 = new Web3(ethereum);

  const [balance, setBalance] = useState("");
  const [connect,setConnect] = useState('connect');
  let [balance2, setBalance2] = useState("");
  const [select, setSelect] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [hash, setHash] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [contract1, setcontract1] = useState("");
  const [contract2, setcontract2] = useState("");
  const [network, setNetwork] = useState("");

  const connectMetamask = async () => {

  
    const TokenAddress = "0x995765e120676263764aB14781Abe228a7EDd015";
    const TokenAddress1 = "0x554BBA98843b661dD2Eda9B750BA4559f23e2E45";
    console.log("window", window);
   
if(network=='')
{
  alert("please choose network")
  return
}
  if (window.ethereum.isMetaMask) {

      // 1 method --------------------      To Get Acoounts Using Ethereum     --------------------------
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("accounts---------------------", accounts);
       

      console.log("sssssssssssss",ethereum.chainId);

      // 2 method --------------------      To Get Acoounts Using Web3      --------------------------
      const addresss = await web3.eth.getAccounts();

      console.log("------", addresss, web3);

      setAddress(addresss[0]);

      console.log("adddddddddddddddddd", address);

      // const balance1 = await web3.eth.getBalance(addresss[0]);
      // console.log("balance1", balance1 / 10 ** 18);
      // setBalance(balance1 / 10 ** 18);
      if(network=='Mainnet')
{
        await window.ethereum.request({ 
        method: 'wallet_switchEthereumChain',
        params: [{chainId:'0x1'}]}).then(()=>{
          setConnect("Wallet Connected")
         // setNetwork("Mainnet")
        });
      const balance1 = await web3.eth.getBalance(addresss[0]);
      console.log("balance1", balance1 / 10 ** 18);
      setBalance(balance1 / 10 ** 18);
}

else if(network=='Ropsten Test Network')
{
  await window.ethereum.request({ 
    method: 'wallet_switchEthereumChain',
    params: [{chainId:'0x3'}]}).then(()=>{
      setConnect("Wallet Connected")
      //setNetwork("Ropsten Test Network")
    });
    const balance1 = await web3.eth.getBalance(addresss[0]);
      console.log("balance1", balance1 / 10 ** 18);
      setBalance(balance1 / 10 ** 18);
}
      

      //------------------           Creating Instance of the contract      ------------------------
      let contract = new web3.eth.Contract(TokenAbi, TokenAddress);
      setcontract1(contract);
      let contract2 = new web3.eth.Contract(TokenAbi2, TokenAddress1);
      setcontract2(contract2);

      // console.log(
      //   window.ethereum.networkVersion,
      //   "window.ethereum.networkVersion"
      // );
      //  ----------------      Balance check using the contract    -----------------------------

      // await contract.methods
      //   .balanceOf(accounts[0])
      //   .call()
      //   .then((result) => {
      //     console.log("result", result / 10 ** 18);
      //   });

        try {
         await contract2.methods
        .balanceOf(accounts[0])
        .call()
        .then((result1) => {
          console.log("contract2 balance", result1 / 10 ** 18);
          setBalance2(result1 / 10 ** 18);
        });
        } catch (error) {
          setBalance2(0);
          console.log("error",error);
        }
      
    } else {
      alert("please install metamask");
    }
  };
  
   
  useEffect(()=>{
  console.log("jjjjjjjjjjjjjjjj",connect);
//   if(window.ethereum) {
    
//     window.ethereum.on('accountsChanged', () => {
//       window.location.reload();
//     })
// }
    if(connect=='Wallet Connected'){
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
    connectMetamask()
    }
  },[network])

  const transferMoney = async (e) => {

    const addresss = await web3.eth.getAccounts();
    if (address !== "") {
      e.preventDefault();
      const { ethereum } = window;
      web3 = new Web3(ethereum);
      console.log("amount*10**18", amount * 10 ** 18);
      if (select === "Ehtereum") {
        console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        try {
          await web3.eth
            .sendTransaction({
              from: address,
              to: senderAddress,
              value: amount * 10 ** 18,
            })
            .then((res) => {
              console.log(res.blockHash, "res");
              setHash(res.blockHash);
            });
        } catch (error) {
          console.log("error", error.message);
          alert(error.message);
        }
      }
      if (select === "Token") {
        try {
          let ss = amount * 10 ** 18;
          console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", ss.toString());

          await contract2.methods
            .transfer(senderAddress, ss.toString())
            .send({ from: addresss[0] })
            .then((res) => {
              console.log(res, "res");
              setHash(res.blockHash);
            });
        } catch (error) {
          console.log("error", error);

          alert(error.message);
        }
      }
    } else {
      alert("please connect your wallet");
    }
  };

  return (
    <div>
      <h1>Walletweb3</h1>
      
      <div>
        <button onClick={connectMetamask}>{connect}</button> <nsbp></nsbp>
        <select name="Network" onChange={(e) => setNetwork(e.target.value)}>
            <option value="">Network </option>
            <option value="Mainnet">Mainnet</option>
            <option value="Ropsten Test Network">Ropsten-Test-Network</option>
          </select>
          <br></br>
        <br></br><br></br>
        <table  style={{textAlign:"left",marginLeft:"auto",marginRight:"auto"}}>
          <tr>
          <th>
           Network
          </th>
          <td>
          {network}
          </td>
          </tr>
          <tr>
          <th>
           Address
          </th>
          <td>
          {address}
          </td>
          </tr>
          <tr>
          <th>
           Account Balance
          </th>
          <td>
          {balance}
          </td>
          </tr>
          <tr>
          <th>
           Token Balance
          </th>
          <td>
          {balance2}
          </td>
          </tr>
          

        </table>
        

        <form>
          <select name="Transfer" onChange={(e) => setSelect(e.target.value)}>
            <option value="">select</option>
            <option value="Ehtereum">Ehtereum</option>
            <option value="Token">Token</option>
          </select>
          <br></br>
          <br></br>
          <label> address</label>
          <input
            type="text"
            placeholder="enter address"
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
          />
          <br></br>
          <br></br>
          <br></br>
          <label>Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br></br>
          <br></br>

          <button type="button" onClick={(e) => transferMoney(e)}>
            send
          </button>
        </form>
        <h3>hash Address: {hash}</h3>
      </div>
    </div>
  );
}

export default Walletweb3;
