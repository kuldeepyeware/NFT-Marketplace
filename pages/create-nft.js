import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";
import NFTMarketplace from "../NFTMarketplace.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const onChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const urls = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const res = await axios.post(urls, formData, {
          headers: {
            Accept: "text/plain",
            pinata_api_key: process.env.NEXT_PUBLIC_API_Key,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_API_Secret,
          },
        });

        const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
        console.log(url);
        setFileUrl(url);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  };

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = {
      name,
      description,
      image: fileUrl,
    };
    try {
      const urls = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const res = await axios.post(urls, data, {
        headers: {
          Accept: "text/plain",
          pinata_api_key: process.env.NEXT_PUBLIC_API_Key,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_API_Secret,
        },
      });
      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }
  return (
    <div className='flex justify-center'>
      <div className='w-1/2 flex flex-col pb-12'>
        <input
          placeholder='Name'
          className='mt-8 border rounded p-4'
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder='Description'
          className='mt-2 border rounded p-4'
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder='Price in Eth'
          className='mt-2 border rounded p-4'
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type='file' name='Asset' className='my-4' onChange={onChange} />
        {fileUrl && <img className='rounded mt-4' width='350' src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'>
          Create NFT
        </button>
      </div>
    </div>
  );
}
