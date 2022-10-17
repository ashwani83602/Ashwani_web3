import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TokenAbi2 from "../src/ABI/Token_Ab2.json";

function NewWallet() {
  const [connect, setConnect] = useState("connect");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [select, setSelect] = useState("");

  // const [balance, setBalance] = useState("");
  // const [connect,setConnect] = useState('connect');
  let [balance2, setBalance2] = useState("");
  // const [select, setSelect] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [hash, setHash] = useState("");
  const [amount, setAmount] = useState("");
  // const [address, setAddress] = useState("");
  const [contract1, setcontract1] = useState("");
  const [contract2, setcontract2] = useState("");
  // const [network, setNetwork] = useState("");

  const TokenAddress = "0x554BBA98843b661dD2Eda9B750BA4559f23e2E45";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();  
  const fun = async () => {
   
    const accounts = await provider.listAccounts();
    setAddress(accounts[0]);
    if(accounts[0]){
      
      setConnect("Wallet Connected");
    }

    const result = await provider.getNetwork();

    if (result.chainId == "3") {
      setNetwork("Ropsten Test Network");
    } else if (result.chainId == "1") {
      setNetwork("Mainnet");
    } else if (result.chainId == "42") {
      setNetwork("Koven");
    } else if (result.chainId == "4") {
      setNetwork("Rinkby");
    } else {
      setNetwork("Rinkbynnnnnn");
    }

    await provider.getBalance(accounts[0]).then((result) => {
      setBalance(result.toString() / 10 ** 18);
    });

    const contract = new ethers.Contract(TokenAddress, TokenAbi2, signer);
    console.log("jjjjjjjjj", network);

    if (result.chainId == "1" || result.chainId == "42") {
      setContractName("no contract ");
      setContractBalance("0");
    } else {
      await contract.name().then((result) => {
        setContractName(result);
      });
      await contract.balanceOf(accounts[0]).then((result) => {
        setContractBalance((result / 10 ** 18).toString())
      });
    }
  };
  const changeNetwork1 = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  };
  useEffect(() => {
    window.ethereum.on("chainChanged", () => {
      if (connect === "Wallet Connected") {
        fun();
      }
      // window.location.reload();
    });
  }, [network]);

  const transferMoney = async (e) => {
console.log(amount,senderAddress);
if (address !== "") {
  if (select === "Ehtereum") {

    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    try {
      await signer.sendtransaction(senderAddress,(amount*10**18).toString())
        
        .then((res) => {
          console.log(res.blockHash, "res");
          setHash(res.blockHash);
        });
    } catch (error) {
      console.log("error", error.message);
      alert(error.message);
    }
  }

}
  };

  return (
    <div>
      <h3>Working with Ethers</h3>
      <br></br>
      <button onClick={fun}>
        <h5>{connect}</h5>
      </button>
      <br></br>
      <br></br>
      <div>
      <table
        style={{ textAlign: "left", marginLeft: "auto", marginRight: "auto" }}
      >
        <tr>
          <th>Network</th>
          <td>
            {connect == "Wallet Connected" && network != "" ? (
              network == "Mainnet" || network == "Ropsten Test Network" ? (
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
          <th>Contract Name</th>
          <td>{contractName}</td>
        </tr>
        <tr>
          <th>Contract Balance</th>
          <td>{contractBalance}</td>
        </tr>
        {/* <tr>
            <th>Token Balance</th>
            <td>{balance2}</td>
          </tr> */}
      </table>
      <select name="Transfer" onChange={(e) => setSelect(e.target.value)}>
            <option value="">select</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Token">Token</option>
          </select>
      </div>
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
    </div>
  );
}

export default NewWallet;
