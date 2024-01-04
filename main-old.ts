// Enter `npm run dev` into your terminal to run.

import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

// const rpcUrl = 'https://public.stackup.sh/api/v1/node/bsc-testnet';
const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const paymasterUrl =
  'https://api.stackup.sh/v1/paymaster/0beb81cbba98b73fc6f8e6c24ff69062c50d35075757967a7d3b9dcde6c2e772'; // Optional - you can get one at https://app.stackup.sh/

async function main() {
  const paymasterContext = { type: 'payg' };
  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  // const opts =
  //   paymasterUrl.toString() === ''
  //     ? {}
  //     : {
  //         paymasterMiddleware: paymasterMiddleware,
  //       };
  const paymaster = {
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    factory: '0x9406Cc6185a346906296840746125a0E44976454',
  };
  // Initialize the account
  // const signingKey = "0x4337433743374337433743374337433743374337433743374337433743374337";
  const signingKey =
    '0x1234123412341234123412341234123412341234123412341234123412341235';
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(signingKey,provider);
  var builder = await Presets.Builder.SimpleAccount.init(signer, rpcUrl, paymaster);
  const address = builder.getSender();
  console.log(`Account address: ${address}`);


  const token = '0x3870419Ba2BBf0127060bCB37f69A1b1C090992B'; // Address of the ERC-20 token
  const value = '10'; // Amount of the ERC-20 token to transfer
  const TOKEN_ABI = require('./tokenAbi.json'); // ERC-20 ABI in json format
  const erc20 = new ethers.Contract(token, TOKEN_ABI, signer);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);
  console.log(`amount : ${amount}`);
  const res = await erc20.transfer("0x22fed3031422bFA3AfF6f42905697Ab6E9BFd58a", amount,
    { 
      gasPrice: 5000000,gasLimit: 5000000 });

  // Create the call data
  // const paymasterAddress = '0x99eb87F560caE59a77B8bc21EB35A61992ee108B';
  // const to = address; // Receiving address, in this case we will send it to ourselves
  // const token = '0x3870419Ba2BBf0127060bCB37f69A1b1C090992B'; // Address of the ERC-20 token
  // const value = '1'; // Amount of the ERC-20 token to transfer

  // // Read the ERC-20 token contract
  // const ERC20_ABI = require('./erc20Abi.json'); // ERC-20 ABI in json format
  // const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  // const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  // const decimals = await Promise.all([erc20.decimals()]);
  // const amount = ethers.utils.parseUnits(value, decimals);
  // // Encode the calls
  // const callTo = [token, token];
  // const callData = [
  //   erc20.interface.encodeFunctionData('approve', [to, amount]),
  //   erc20.interface.encodeFunctionData('transfer', [to, amount]),
  // ];

  // // Send the User Operation to the ERC-4337 mempool
  // const client = await Client.init(rpcUrl);
  // const res = await client.sendUserOperation(
  //   builder.executeBatch(callTo, callData),
  //   {
  //     onBuild: (op) => console.log('Signed UserOperation:', op),
  //   }
  // );

  // Return receipt
  // console.log(`UserOpHash: ${res.userOpHash}`);
  console.log('Waiting for transaction...');
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
  // console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}`);
}

main().catch((err) => console.error('Error:', err));
