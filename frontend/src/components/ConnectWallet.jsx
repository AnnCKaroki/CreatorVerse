import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import CreatorPlatformABI from '../contracts/CreatorPlatformABI';

function Wallet() {
  return (
    <div>
      <h2>Wallet Component</h2>
      {/* Add more wallet-related UI here */}
    </div>
  );
}

ConnectWallet.propTypes = {
  setProvider: PropTypes.func.isRequired,
  setSigner: PropTypes.func.isRequired,
};

export default function ConnectWallet({ setProvider, setSigner }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const storedAccount = localStorage.getItem("connectedAccount");
          if (storedAccount) {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0 && accounts.includes(storedAccount)) {
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              setProvider(provider);
              setSigner(signer);
              setAccount(storedAccount);
              setConnected(true);
            } else {
              localStorage.removeItem("connectedAccount");
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          localStorage.removeItem("connectedAccount");
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem("connectedAccount", accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem("connectedAccount");
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [setProvider, setSigner]);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
          alert("No accounts found. Please connect to MetaMask.");
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setConnected(true);
        localStorage.setItem("connectedAccount", accounts[0]);

        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, CreatorPlatformABI, signer);
        console.log('Contract:', contract);

        alert("Connected successfully!");
      } catch (error) {
        console.error("Error connecting:", error);
        alert("Failed to connect. Please try again.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setConnected(false);
    localStorage.removeItem("connectedAccount");
    alert("Disconnected successfully!");
  };

  return (
    <div>
      <Wallet />
      {!connected ? (
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected account: {account}</p>
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
