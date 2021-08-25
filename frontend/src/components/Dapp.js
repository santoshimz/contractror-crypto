import React from "react";

import { ethers } from "ethers";
import FreeLancerArtifact from "../contracts/Freelancer.json";
import contractAddress from "../contracts/freelancer-contract-address.json";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { LatestContract }  from './LatestContract';
import AcceptedJobs from './AcceptedJobs';
import FundedJobs from './FundedJobs';
const HARDHAT_NETWORK_ID = '1337';

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const styles = {
  container: {
    margin: '40px',
  }
}
const Dapp = () => {
  const [totalContracts, setTotalContracts] = React.useState(0);
  const [latestContractValue, setLatestContractValue] = React.useState(null);
  const [ latestContractDescription, setLatestContractDescription] = React.useState(null);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [txBeingSent, setTxBeingSent] = React.useState(null);
  const [transactionError, setTransactionError] = React.useState(null);
  const [networkError, setNetworkError] = React.useState(null);
  const [agreement, setAgreement ] = React.useState(null);
  const [pollData, setPollData] = React.useState(false);
  const [pollDataInterval, setPollDataInterval] = React.useState(null);
  
  const connectWallet = async() => {
    const [selectedAddress] = await window.ethereum.enable();
    if (!checkNetwork()) {
      return;
    }
    initialize(selectedAddress);
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      stopPollingData();
      if (newAddress === undefined) {
        return resetState();
      }
      initialize(newAddress);
    });
    window.ethereum.on("networkChanged", () => {
      stopPollingData();
      resetState();
    });
  }

  const intializeEthers= () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const agreement = new ethers.Contract(
        contractAddress.Token,
        FreeLancerArtifact.abi,
        provider.getSigner(0)
      );
      setAgreement(agreement);
  }

  React.useEffect(() => {
    if (pollData) {
      const pollDataInterval = setInterval(() => {
      }, 1000);
      setPollDataInterval(pollDataInterval);
    } else {
      clearInterval(pollDataInterval);
    }
  }, [pollData, pollDataInterval]);

  const startPollingData = () => {
   setPollData(true);
  }

  React.useEffect(() => {
    return () => {
      stopPollingData();
    } 
  })

  const stopPollingData = () => {
    setPollData(false);
  }

  const initialize = async (userAddress) => {
    setSelectedAddress(userAddress);
    intializeEthers();
    await getContractData();
    startPollingData();
  }

  const getContractData = async () => {
    const agreementData = agreement && await agreement.Contracts;
    console.log('agreementData', agreementData);
  }

  const updateWork  = async () =>  {
    const work = await agreement.getContracts();
    const totalContracts = await agreement.getTotalContracts();
    const latestContract = await agreement.getLatestContract();
    const description = latestContract[0];
    const value = parseInt(latestContract[1]);
    setTotalContracts(parseInt(totalContracts));
    setLatestContractDescription(description);
    setLatestContractValue(value);
  }

  const fundWork = async (description, value, to) => {
    try {
      dismissTransactionError();
      try {
        const tx = await agreement.fundWork(description, parseInt(value), to);
        setTxBeingSent(tx.hash);
        const receipt = await tx.wait();
        if (receipt.status === 0) {
          console.log('receipt', receipt);
          throw new Error("Transaction failed");
        }
      } catch (error) {
        console.error(error);
      }
      await updateWork();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      setTransactionError(error);
    } finally {
      setTxBeingSent(null);
    }
  }


  const dismissTransactionError = () => {
    setTransactionError(null);
  }

  const dismissNetworkError = () => {
    setNetworkError(null);
  }

  const resetState  = () => {
    // reset everything
  }

  const checkNetwork = () => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    setNetworkError('Please connect Metamask to Localhost:8545');
    return false;
  }
  
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }
  
  if (!selectedAddress) {
    return (
      <ConnectWallet 
        connectWallet={connectWallet} 
        networkError={networkError}
        dismiss={dismissNetworkError}
      />
    );
  }

  //TODO: Fetch contracts from blockchain
  return (
    <div style={styles.container}>
      <h4>List of the jobs accepted by freelancers</h4>
      <AcceptedJobs fundWork={(description, value, to) =>
          fundWork(description, value, to)
        } 
      />
      {totalContracts > 0 ?  `Total Funded Contracts on Blockchain ${totalContracts}` : null}
      <LatestContract latestContractDescription={latestContractDescription} latestContractValue={latestContractValue} />
      <br />
      <h4>List of the jobs on Blockchain</h4>
      <FundedJobs />
    </div>
  );
  
}

export default Dapp;