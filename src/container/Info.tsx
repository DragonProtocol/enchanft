import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { Signer, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js'

import NFTHandler from '../components/NFTHandler'

import { getMetadataFromMint } from '../features/my/myData'
import NFTShower from '../components/NFTShower'

import idl from '../synftIdl.json'
import { Synft } from '../synft'

const programId = new PublicKey(idl.metadata.address)

export default function Info() {
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const { connection } = useConnection()

  const programRef = useRef<Program<Synft> | null>(null)
  const [metadata, setMetadata] = useState<any>({})
  const [belongToMe, setBelongToMe] = useState(false)

  useEffect(() => {
    initProgram()
    getMetadata()
  }, [connection])

  useEffect(() => {
    checkBelongToMe()
  }, [connection, wallet])

  function initProgram() {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, programId, provider) as Program<Synft>
    programRef.current = program
  }

  async function checkBelongToMe() {
    if (!params.mint || !wallet.publicKey) return
    const mintKey = new PublicKey(params.mint)
    try {
      const data = await getAssociatedTokenAddress(mintKey, wallet.publicKey)
      const mintTokenAccount = await getAccount(connection, data)
      const belong = mintTokenAccount?.owner.toString() === wallet.publicKey.toString()
      // console.log({ mintTokenAccount }, mintTokenAccount?.owner.toString(), wallet.publicKey.toString())
      setBelongToMe(belong)
    } catch (error) {
      log.warn('checkBelongToMe', error)
    }
  }

  async function getMetadata() {
    if (!params.mint) return
    const mintKey = new PublicKey(params.mint)
    try {
      // TODO: could filter from redux store first
      const data = await getMetadataFromMint(connection, mintKey)
      setMetadata(data.toJSON().data)
    } catch (error) {
      log.warn('getMetadata', error)
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
    if (childrenMetadata) {
      alert('connot inject')
      return
    }

    // Inject
    const tx: Transaction = await program.transaction.initializeSolInject(...[true, metadataBump, injectSolAmount], {
      accounts: {
        currentOwner: wallet.publicKey,
        parentTokenAccount: mintTokenAccount.address,
        childrenMeta: metadataPDA,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [],
    })
    const signature = await wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    console.log('injectSol result', result)
  }

  async function injectNFT() {
    console.log('injectNFT')
    if (!wallet.publicKey || !programRef.current || !params.mint) return
    const program = programRef.current

    const kp = Keypair.generate()
    const parentMintKey = new PublicKey(params.mint)
    const parentMintTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      kp,
      parentMintKey,
      wallet.publicKey,
      true,
    )
    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('children-of'), parentMintTokenAccount.address.toBuffer()],
      programId,
    )

    const mintKey = new PublicKey('AfDjAmpsHyeXjhxLD2GfFsVpUBT4NP9CvskcKCmd68RA')

    const mintTokenAccount = await getOrCreateAssociatedTokenAccount(connection, kp, mintKey, wallet.publicKey, true)

    console.log({ mintTokenAccount, parentMintTokenAccount })
    console.log(mintTokenAccount.owner.toBase58(), wallet.publicKey.toBase58(), parentMintTokenAccount.owner.toString())

    const tx = await program.transaction.initializeInject(true, metadataBump, {
      accounts: {
        currentOwner: wallet.publicKey,
        childTokenAccount: mintTokenAccount.address,
        parentTokenAccount: parentMintTokenAccount.address,
        childrenMeta: metadataPDA,

        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [],
    })
    const signature = await wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    console.log('injectSol result', result)
    // console.log("initTx :", initTx);
    const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
    console.log({ childrenMeta })
    // assert.ok(childrenMeta.reversible == true);
    // console.log("before setAuthority ", tokenAccount3.owner.toString());
    // assert.ok(childrenMeta.bump == _metadata_bump4);
    // tokenAccount3 = await getAccount(connection, tokenAccount3.address);
    // assert.ok(tokenAccount3.owner.equals(_metadata_pda4));
  }

  async function extractNFT() {
    console.log('extractNFT')
    if (!wallet.publicKey || !programRef.current || !params.mint) return
    const program = programRef.current

    const kp = Keypair.generate()
    const parentMintKey = new PublicKey(params.mint)
    const parentMintTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      kp,
      parentMintKey,
      wallet.publicKey,
      true,
    )

    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('children-of'), parentMintTokenAccount.address.toBuffer()],
      programId,
    )
    console.log('_metadata_pda is ', metadataPDA.toString())

    const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
    const childTokenAccount = childrenMeta.child

    // getAccount(connection, _metadata_pda); // account exists
    const tx = await program.transaction.extract(metadataBump, {
      accounts: {
        currentOwner: wallet.publicKey,
        childTokenAccount,
        parentTokenAccount: parentMintTokenAccount.address,
        childrenMeta: metadataPDA,

        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [],
    })
    const signature = await wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    console.log('extractTx result :', result)
    // try {
    //   getAccount(connection, _metadata_pda);
    // } catch (error: any) {
    //   assert.ok(error.message == "TokenAccountNotFoundError");
    // }
  }

  async function burnWithSolRedeem() {
    console.log('burnWithSolRedeem')
  }

  async function extractSol() {
    console.log('extractSol')
    if (!wallet.publicKey || !params.mint || !programRef.current) return

    const program = programRef.current
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

    // getAccount(connection, _metadata_pda); // account exists
    const extractTx = await program.transaction.extractSol(metadataBump, {
      accounts: {
        currentOwner: wallet.publicKey,
        parentTokenAccount: mintTokenAccount.address,
        childrenMeta: metadataPDA,

        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [],
    })
    const signature = await wallet.sendTransaction(extractTx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    console.log('extractSol result', result)

    // console.log("extractTx :", extractTx);
    // const solAccountUser2 = await anchor
    //   .getProvider()
    //   .connection.getAccountInfo(user2.publicKey);
    // console.log("solAccountUser2.lamports ", solAccountUser2.lamports);
    // assert.ok(solAccountUser2.lamports > 1500000000);

    // let metaDataAfter = await program.account.childrenMetadata.fetchNullable(_metadata_pda);
    // assert.ok(metaDataAfter === null);
  }

  const showerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  const handlerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  return (
    <InfoWrapper>
      <div className="left">
        <NFTShower data={showerData} />
      </div>
      <div className="right">
        <NFTHandler data={handlerData} />
      </div>
    </InfoWrapper>
  )
}

const InfoWrapper = styled.div`
  display: flex;
  .left,
  .right {
    width: 50%;
  }
`
