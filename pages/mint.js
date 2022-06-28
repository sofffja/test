import Head from 'next/head'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from '../components/Header';
import Link from 'next/link';
import { useAccount, useContract, useProvider, useContractWrite, useWaitForTransaction, useContractRead, etherscanBlockExplorers } from 'wagmi';
import * as ERC721_abi from "../ZoraNFTCreatorProxy-Hardhat/node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import PostMintDialog from '../components/PostMintDialog';

const heavenly = "#40bedc"


const Mint = () => {

   // get account hook
   const { data: account, isError: accountError, isLoading: accountLoading } = useAccount(); 
   const currentUserAddress = account ? account.address.toString() : ""

     // totalSupply read call
   const { data: totalSupplyData, isError: totalSupplyError, isLoading: totalSupplyLoading } = useContractRead(
      {
         addressOrName: "0xD4f6eF98791cfBAD1D136fe260835531Ca36140C",
         contractInterface: ERC721_abi.abi
      },      
      "totalSupply",
      {
         watch: true,
      },
      {
         onError(error) {
            console.log("error: ", error)
         },
         onSuccess(totalSupplyData) {
            console.log("totalSupply: ", totalSupplyData)
         },
      },   
   )   

   // mint call
   const mintPrice = "10000000000000000" // 0.01 eth

   const { data: holderMintData, isError: holderMintError, isLoading: holderMintLoading, status: holderMintStatus, write: holderMintWrite } = useContractWrite(
      {
         addressOrName: "0xD4f6eF98791cfBAD1D136fe260835531Ca36140C",
         contractInterface: ERC721_abi.abi
      },
      "purchase",
      {
         args: [
            "1" // quantity
         ],
         overrides: {
            value: mintPrice 
         },
         onError(error) {
            console.log("Error: ", error)
         }
      }
   )
   
   const { data: holderMintWaitData, isError: holderMintWaitError, isLoading: holderMintWaitLoading } = useWaitForTransaction({
      hash:  holderMintData?.hash,
      onSuccess(holderMintWaitData) {
         console.log("txn complete: ", holderMintWaitData)
         console.log("txn hash: ", holderMintWaitData.transactionHash)
      }
   })           


   return (
      <div>
         <Header />
         <main>
            <div className="text-white">
               THIS IS THE MINT PAGE
            </div>
            <div className="mt-20 flex flex-row justify center">
               <div className="w-full flex flex-wrap flex-row justify-center ">
                  <div className="mb-10 flex flex-row justify-center w-full text-white">
                     {`${10 - totalSupplyData} / 10 Remaining`}
                  </div>
                  <button
                     className="w-full mx-[700px] p-2 bg-red-600 flex flex-row justify-center text-white border-2 border-solid border-white"
                     onClick={() => holderMintWrite()}
                  >                     
                     MINT
                  </button>
                  <PostMintDialog 
                     holderTxnLoadingStatus={holderMintWaitLoading}
                     holderTxnSuccessStatus={holderMintStatus}
                     holderTxnHashLink={holderMintWaitData}
                     colorScheme={heavenly}
                  />
                  { holderMintWaitLoading === true ? (
                     <div className="w-full text-xl sm:text-2xl mt-10 flex flex-row flex-wrap justify-center ">           
                        <img
                           className="bg-[#40bedc] p-1 rounded-3xl mb-8 w-fit flex flex-row justify-self-center items-center"
                           width="20px" 
                           src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                        />
                        <div className="w-full text-center">
                           Mint Price: 0.01 Ξ
                        </div>                        
                     </div>   
                     ) : (                  
                     <div className="w-full text-xl sm:text-2xl mt-10 flex flex-row flex-wrap justify-center ">
                        <div className="w-full text-center">
                           Mint Price: 0.01 Ξ
                        </div>
                     </div>                                          
                  )}                         
                  <Link href="/">
                     <a className="w-full text-white mt-5 text-xl flex flex-row justify-center text-center">
                        ← BACK TO HOME
                     </a>
                  </Link>                          
               </div>          
            </div>
         </main>
      </div>
   )
}

export default Mint;