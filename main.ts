import { Mumbai } from "@thirdweb-dev/chains";
import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";

export const TWFactoryAddress = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
export const activeChain = Mumbai;

export const editionDropAddress = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
export const editionDropTokenId = "0";

async function main() {
    const localWallet = new LocalWallet();

    await localWallet.generate();

    const localWalletAddress = await localWallet.getAddress();
    console.log(`✨ Local wallet address: ${localWalletAddress}`);
    const smartWallet = new SmartWallet({
        chain: activeChain,
        factoryAddress: TWFactoryAddress,
        secretKey: 'taODipHQB5Fen_syCKwyQhk-Qv03vV7HY5qwJIH28Z5OghNXrDqGDfFv4yuamZ1VHQX7EINb77B-miSuA04uOA',
        gasless: true,
      });
      
      await smartWallet.connect({
        personalWallet: localWallet,
      });
      
      console.log(`✨ Smart wallet: ${smartWallet}`);
      const smartWalletAddress = await smartWallet.getAddress();
      console.log(`✨ Smart wallet address: ${smartWalletAddress}`);
}

main().catch((err) => console.error('Error:', err));