import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import CreatorPlatformABI from '../contracts/CreatorPlatformABI';

function ProductForm({ provider, signer, contractAddress }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [network, setNetwork] = useState(null);
  const [products, setProducts] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const network = await provider.getNetwork();
        setNetwork(network);
      } catch (error) {
        console.error('Error fetching network:', error);
      }
    };

    const checkRegistration = async () => {
      const contract = new ethers.Contract(contractAddress, CreatorPlatformABI, signer);
      try {
        const address = await signer.getAddress();
        const creator = await contract.creators(address);
        setIsRegistered(creator.name !== '');
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    };

    if (provider && signer) {
      fetchNetwork();
      checkRegistration();
    }
  }, [provider, signer, contractAddress]);

  const registerCreator = async () => {
    const contract = new ethers.Contract(contractAddress, CreatorPlatformABI, signer);
    try {
      const tx = await contract.createProfile('Your Name', 'Your Description');
      await tx.wait();
      setIsRegistered(true);
      alert('Registered successfully!');
    } catch (error) {
      console.error('Error registering creator:', error);
      alert(`Failed to register: ${error.message}`);
    }
  };

  const addProduct = async () => {
    if (!isRegistered) {
      alert('You must be registered as a creator to add products.');
      return;
    }

    const contract = new ethers.Contract(contractAddress, CreatorPlatformABI, signer);
    try {
      const tx = await contract.addProduct(title, description, ethers.parseEther(price));
      await tx.wait();
      alert('Product added successfully!');
      setProducts([...products, { title, description, price }]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product. Please ensure you are registered as a creator and try again. Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {network && <p>Connected to {network.name || `Chain ID: ${network.chainId}`}</p>}
      {!isRegistered && (
        <button onClick={registerCreator} className="bg-blue-500 text-white px-4 py-2 rounded">
          Register as Creator
        </button>
      )}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price (EDU)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Product
      </button>

      <h2>Added Products</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <strong>Title:</strong> {product.title} <br />
            <strong>Description:</strong> {product.description} <br />
            <strong>Price:</strong> {product.price} EDU
          </li>
        ))}
      </ul>
    </div>
  );
}

ProductForm.propTypes = {
  provider: PropTypes.object.isRequired,
  signer: PropTypes.object.isRequired,
  contractAddress: PropTypes.string.isRequired,
};

export default ProductForm;
