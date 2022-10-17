import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useEthers } from "@usedapp/core";
import Web3Modal from "web3"
import TokenAbi from "../src/ABI/Token_Abi.json";
import TokenAbi2 from "../src/ABI/Token_Ab2.json";

function Walletfun() {
  const {  deactivate } = useEthers();
  let web3;
  let changeNetwork;
  const { ethereum } = window;
  web3 = new Web3(ethereum);
  const web3Modal = new Web3Modal
  console.log("mmmmmmmhhhhhhhhhhhhhhhhhhhhhhhhhhh",web3Modal);


  // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",web3.eth.currentProvider);

  const [balance, setBalance] = useState("");
  const [connect, setConnect] = useState("connect");
  const [disconnect, setDisConnect] = useState("disconnect");

  let [balance2, setBalance2] = useState("");
  const [select, setSelect] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [hash, setHash] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [contract1, setcontract1] = useState("");
  const [contract2, setcontract2] = useState("");
  const [network, setNetwork] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromamount, setFromamount] = useState("");
  const [approve, setApprove] = useState("");
  const [approveAmount, setApproveAmount] = useState("");





  

 
  const connectMetamask = async () => {
    const TokenAddress = "0x995765e120676263764aB14781Abe228a7EDd015";
    // const TokenAddress1 = "0x554BBA98843b661dD2Eda9B750BA4559f23e2E45";
     const TokenAddress1 = "0xB8B1fF9d62eb8dcbB98bC7B8D006b8f5F873f5a3";

    console.log("window", window);

    //   if(network=='')
    //   {
    //     alert("please choose network")
    //     return
    //   }
   
    if (window.ethereum.isMetaMask) {
      // 1 method --------------------      To Get Acoounts Using Ethereum     --------------------------
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("accounts---------------------", accounts);

      console.log("sssssssssssss", ethereum.chainId);

      // 2 method --------------------      To Get Acoounts Using Web3      --------------------------
      const addresss = await web3.eth.getAccounts();

      console.log("------", addresss, web3);

      setAddress(addresss[0]);
      setConnect("Wallet Connected");
      console.log("adddddddddddddddddd", address, ethereum.chainId);

      if (
        ethereum.chainId == "0x1" ||
        ethereum.chainId == "0x3" ||
        ethereum.chainId == "0x38"
      ) {
        if (ethereum.chainId === "0x1") {
          setNetwork("Mainnet");
        } else if (ethereum.chainId == "0x3") {
          setNetwork("Ropsten Test Network");
        }
        else if(ethereum.chainId == "0x38"){
          console.log("BSC test nret");
          setNetwork("Bsc Test Network");
        }
        const balance1 = await web3.eth.getBalance(addresss[0]);
        console.log("balance1", balance1 / 10 ** 18);
        setBalance(balance1 / 10 ** 18);
      } else {
        if (ethereum.chainId == "0x2a") setNetwork("Kova Test Network");
        if (ethereum.chainId == "0x4") setNetwork("Rinkyby Test Network");
        setBalance("0");
      }
    

      //------------------           Creating Instance of the contract      ------------------------
      let contract = new web3.eth.Contract(TokenAbi, TokenAddress);
      setcontract1(contract);
      let contract2 = new web3.eth.Contract(TokenAbi2, TokenAddress1);
      setcontract2(contract2);

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
        console.log("error", error);
      }
    } else {
      alert("please install metamask");
    }
  };
  const handler = (connectInfo) => {
    console.log("connectInfoconnectInfo",connectInfo);

  }
  const disconnectMetamask = () => {

    window.location.reload()
    

  }
  const changeNetwork1 = async () =>{
    await window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      })
    
}
  useEffect(() => {
    window.ethereum.on("chainChanged", () => {
      if (connect ==="Wallet Connected") {
        connectMetamask();
      }
      // window.location.reload();
    });
    //   window.ethereum.on('accountsChanged', () => {
    //     window.location.reload();
    //   })
  });

//   useEffect(() => {
//     console.log("jjjjjjjjjjjjjjjj", connect);

//     //   if(connect=='Wallet Connected'){

//     //   connectMetamask()
//     //   }
//   }, [network]);

  const transferMoney = async (e) => {
    const addresss = await web3.eth.getAccounts();
    if (address !== "") {
      e.preventDefault();
      const { ethereum } = window;
      web3 = new Web3(ethereum);
      console.log("amount*10**18", amount * 10 ** 18);
      if (select === "Ethereum") {
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
console.log("llllllll",connect);

const fromTo = async () =>{
    if (address !== ""){
    console.log(to);
    console.log(from,fromamount,)
    let ss = fromamount*10**18;
    console.log(ss);
    if (select === "Token") {

    await contract2.methods.transferFrom(from,to,ss.toString()).send({ from: address }).then((result)=>{
      setHash(result.blockHash)
    })
    }
    else if(select === "Ethereum"){
      alert("you can send only Token in Transfer From ")
    }

}
}
const approveFun = async () => {
    let aa = approveAmount*10**18
console.log(approve,aa);
    await contract2.methods.approve(approve,aa.toString()).send({
        from:address
    })
}

  return (
    <div>
      <h1>Wallet-fun</h1>

      <div>
        <button onClick={connectMetamask}>{connect}</button> <nsbp></nsbp>
        {connect == "Wallet Connected" ? (
          <button onClick={disconnectMetamask}>{disconnect}</button>
        ) : (
          ""
        )}
        <br></br>
        <br></br>
        <table
          style={{ textAlign: "left", marginLeft: "auto", marginRight: "auto" }}
        >
          <tr>
            <th>Network</th>
            <td>
              {connect == "Wallet Connected" ? (
                network == "Mainnet" || network == "Bsc Test Network" ? (
                  network
                ) : (
                  <button onClick={changeNetwork1}>change network</button>
                )
              ) : (
                ""
              )}
            </td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{address}</td>
          </tr>
          <tr>
            <th>Account Balance</th>
            <td>{balance}</td>
          </tr>
          <tr>
            <th>Token Balance</th>
            <td>{balance2}</td>
          </tr>
        </table>
        <br></br>
        <br></br>
        <br></br>
        <select name="Transfer" onChange={(e) => setSelect(e.target.value)}>
          <option value="">select</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Token">Token</option>
        </select>
        <br></br>
        <br></br>
        <div class="row">
          <div class="col-sm-4">
            <h3>Transfer </h3>
            <form>
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
          </div>

          <div class="col-sm-4">
            <h3>Transfer From</h3> <br></br>
            <br></br>
            From Address
            <input
              type="text"
              placeholder="enter address"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <br></br>
            <br></br>
            To Address <nsbp />
            <nsbp />
            <nsbp />
            <nsbp />
            <nsbp></nsbp>
            <input
              type="text"
              placeholder="enter address"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <br></br>
            <br></br>
            Amount
            <input
              type="number"
              placeholder="Amount"
              value={fromamount}
              onChange={(e) => setFromamount(e.target.value)}
            />
            <br></br>
            <br></br>
            <button onClick={fromTo}>Send From </button>
            <br></br>
          </div>
          <div class="col-sm-4">
            <h3>Approve who will you use your wallet</h3>
            <br></br>
            <br></br>
            Approvel Address
            <input
              type="text"
              placeholder="enter address"
              value={approve}
              onChange={(e) => setApprove(e.target.value)}
            />
            <br></br>
            <br></br>
            Approvel Amount
            <input
              type="text"
              placeholder="enter address"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
            />
            <br></br>
            <br></br>
            <button onClick={approveFun}>Approve</button>
          </div>
        </div>
        <br></br>
        <br></br>
      </div>
      <br></br>
      <br></br>
      <h3>hash Address: {hash}</h3>
    </div>
  );
}

export default Walletfun;
