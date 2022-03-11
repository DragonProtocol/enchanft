import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import log from 'loglevel'
import { Signer, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js'

import idl from '../../synftIdl.json'
import { Synft } from '../../synft'

const metadataProgramId = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const MPL_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const programId = new PublicKey(idl.metadata.address)

export async function checkBelongToMe(
  mint: string | undefined,
  wallet: WalletContextState,
  connection: web3.Connection,
): Promise<boolean> {
  if (!wallet.publicKey || !mint) return false
  const mintKey = new PublicKey(mint)
  try {
    const data = await getAssociatedTokenAddress(mintKey, wallet.publicKey)
    const mintTokenAccount = await getAccount(connection, data)
    const belong = mintTokenAccount?.owner.toString() === wallet.publicKey.toString()
    return belong
  } catch (error) {
    log.warn('checkBelongToMe', error)
  }
  return false
}

export async function getInject(
  mint: string | undefined,
  walletPubKey: PublicKey | null,
  connection: web3.Connection,
  program: Program<Synft>,
): Promise<any | null> {
  // TODO: any
  if (!walletPubKey || !mint) return null
  log.info('begin getInject')

  const mintKey = new PublicKey(mint)
  const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    Keypair.generate(),
    mintKey,
    walletPubKey,
    true,
  )

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), mintTokenAccount.address.toBuffer()],
    programId,
  )

  const childrenMetadata = await connection.getAccountInfo(metadataPDA)
  let childrenMeta = null
  if (childrenMetadata) {
    childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
  }

  log.info('getInject', { childrenMetadata, childrenMeta })

  return { childrenMetadata, childrenMeta }
}

export async function nftCopy(
  mint: string,
  { name, symbol, uri }: { name: string; symbol: string; uri: string },
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey) return
  log.info('begin nftCopy')
  const mintKey = new PublicKey(mint)

  const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
    [Buffer.from('synthetic-nft-mint-seed'), mintKey.toBuffer()],
    programId,
  )

  const [nftTokenAccountPDA, nftTokenAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from('synthetic-nft-account-seed'), mintKey.toBuffer()],
    programId,
  )

  const [nftMetadataPDA, nftMetadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), new PublicKey(metadataProgramId).toBuffer(), nftMintPDA.toBuffer()],
    new PublicKey(metadataProgramId),
  )

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
  log.info('nftCopy result', result)
}

export async function injectSol(
  mint: string | undefined,
  solAmount: number,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.info('begin injectSol')
  const injectSolAmount = new BN(solAmount)
  const mintKey = new PublicKey(mint)

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

  // const childrenMetadata = await connection.getAccountInfo(metadataPDA)
  // log.info('injectSol', { childrenMetadata })
  // if (childrenMetadata) {
  //   log.warn('connot injectSol')
  //   return
  // }

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
  log.info('injectSol result', result)
}

export async function extractSol(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.info('begin extractSol')
  const mintKey = new PublicKey(mint)
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
  log.info('extractSol result', result)

  // console.log("extractTx :", extractTx);
  // const solAccountUser2 = await anchor
  //   .getProvider()
  //   .connection.getAccountInfo(user2.publicKey);
  // console.log("solAccountUser2.lamports ", solAccountUser2.lamports);
  // assert.ok(solAccountUser2.lamports > 1500000000);

  // let metaDataAfter = await program.account.childrenMetadata.fetchNullable(_metadata_pda);
  // assert.ok(metaDataAfter === null);
}

export async function injectNFT(
  mint: string | undefined,
  childMint: string,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint || !childMint) return
  log.info('begin injectNFT', { childMint, mint })
  const kp = Keypair.generate()
  const parentMintKey = new PublicKey(mint)
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

  const childMintKey = new PublicKey(childMint)

  const childMintTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    kp,
    childMintKey,
    wallet.publicKey,
    true,
  )

  // console.log({ mintTokenAccount, parentMintTokenAccount })
  // console.log(mintTokenAccount.owner.toBase58(), wallet.publicKey.toBase58(), parentMintTokenAccount.owner.toString())

  const tx = await program.transaction.initializeInject(true, metadataBump, {
    accounts: {
      currentOwner: wallet.publicKey,
      childTokenAccount: childMintTokenAccount.address,
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
  log.info('injectNFT result', result)
  // console.log("initTx :", initTx);
  // const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
  // console.log({ childrenMeta })
}

export async function extractNFT(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.info('begin extractNFT')

  const kp = Keypair.generate()
  const parentMintKey = new PublicKey(mint)
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
  //   console.log('_metadata_pda is ', metadataPDA.toString())

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
  log.info('extractNFT result :', result)
  // try {
  //   getAccount(connection, _metadata_pda);
  // } catch (error: any) {
  //   assert.ok(error.message == "TokenAccountNotFoundError");
  // }
}

// TODO: burn
export async function burnWithdrawSPL() {
  log.error('TODO')
}

export default {}
