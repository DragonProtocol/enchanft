import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Signer, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js'
// import { utils } from '@project-serum/anchor'
// import { Program, Provider } from '@project-serum/anchor'

import { getMetadataFromMint } from '../features/my/myData'
import NFTShower from '../components/NFTShower'

import idl from '../synftIdl.json'
import { Synft } from '../synft'

const programId = new PublicKey(idl.metadata.address)

export default function MyMint() {
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const { connection } = useConnection()

  const programRef = useRef<Program<Synft> | null>(null)
  const [metadata, setMetadata] = useState<any>({})

  useEffect(() => {
    initProgram()
    getMetadata()
  }, [connection])

  function initProgram() {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, programId, provider) as Program<Synft>
    programRef.current = program
  }

  async function getMetadata() {
    if (!params.mint) return
    const mintKey = new PublicKey(params.mint)
    try {
      // TODO: could filter from redux store first
      const data = await getMetadataFromMint(connection, mintKey)
      console.log('---', data)
      setMetadata(data.toJSON().data)
    } catch (error) {
      console.error(error)
    }
  }

  async function nftCopy() {
    if (!wallet.publicKey || !programRef.current) return

    const name = 'copy_nft'
    const symbol = 'nft_symbol'
    const uri = 'https://arweave.net/MwkMActRVmKND2t3Bq1qzrT7PdWtO-ZPVnZxh5SQooA'
    const mintKey = new PublicKey('9JPmULtcSGGrK1DrZ9NGHpU5LRvZXGiWhV1K3T2j6T6Q')
    const program = programRef.current

    const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from('synthetic-nft-mint-seed'), mintKey.toBuffer()],
      programId,
    )
    console.log('_nft_mint_pda:', nftMintPDA)

    const [nftTokenAccountPDA, nftTokenAccountBump] = await PublicKey.findProgramAddress(
      [Buffer.from('synthetic-nft-account-seed'), mintKey.toBuffer()],
      programId,
    )

    const metadataProgramId = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    const [nftMetadataPDA, nftMetadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), new PublicKey(metadataProgramId).toBuffer(), nftMintPDA.toBuffer()],
      new PublicKey(metadataProgramId),
    )
    console.log('_nft_metadata_pda: ', nftMetadataPDA)

    const MPL_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    const tx: Transaction = program.transaction.nftCopy(...[name, symbol, uri], {
      accounts: {
        currentOwner: wallet.publicKey,
        fromNftMint: mintKey,
        nftMetaDataAccount: nftMetadataPDA,
        nftMintAccount: nftMintPDA,
        nftTokenAccount: nftTokenAccountPDA,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mplProgram: MPL_PROGRAM_ID,
      },
      signers: [],
    })
    const signature = await wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    console.log('result', result)

    console.log('nftTokenAccountPDA', nftTokenAccountPDA, nftTokenAccountPDA.toString())
    console.log('_nft_metadata_pda', nftMetadataPDA.toString())
  }

  async function injectSol() {
    console.log('injectSol')
    if (!wallet.publicKey || !programRef.current || !params.mint) return
    const program = programRef.current
    const injectSolAmount = new BN(500000000)
    const mintKey = new PublicKey(params.mint)

    const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      Keypair.generate(),
      mintKey,
      wallet.publicKey,
      true,
    )

    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('children-of'), mintTokenAccount.address.toBuffer()],
      programId,
    )

    const childrenMetadata = await connection.getAccountInfo(metadataPDA)
    console.log({ childrenMetadata })

    // Inject
    // const tx: Transaction = await program.transaction.initializeSolInject(...[true, metadataBump, injectSolAmount], {
    //   accounts: {
    //     currentOwner: wallet.publicKey,
    //     parentTokenAccount: mintTokenAccount.address,
    //     childrenMeta: metadataPDA,
    //     systemProgram: SystemProgram.programId,
    //     rent: web3.SYSVAR_RENT_PUBKEY,
    //   },
    //   signers: [],
    // })
    // const signature = await wallet.sendTransaction(tx, connection)
    // const result = await connection.confirmTransaction(signature, 'processed')
    // console.log('injectSol result', result)
  }

  return (
    <div>
      <h2>Info: {params.mint}</h2>
      {params.mint && <NFTShower addr="" mint={params.mint} uri={metadata.data?.uri || ''} />}
      <button onClick={nftCopy}>create</button>
      <button onClick={injectSol}>InjectSOL</button>
      {/* <button onClick={update}>enchant</button> */}
      <button>burn</button>
      <span>view only</span>
    </div>
  )
}
