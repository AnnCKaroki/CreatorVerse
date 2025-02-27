import { useState } from 'react';
import './App.css';
import ConnectWallet from './components/ConnectWallet';
import ProductForm from './components/ProductForm';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Creator Platform</h1>

      {!signer ? (
        <ConnectWallet setProvider={setProvider} setSigner={setSigner} />
      ) : (
        <ProductForm
          provider={provider}
          signer={signer}
          contractAddress={contractAddress}
        />
      )}
    </div>
  );
}

export default App;
