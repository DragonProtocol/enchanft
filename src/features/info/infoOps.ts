import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, getAccount, Account } from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import log from 'loglevel'
import { Signer, PublicKey, SystemProgram, Transaction, Connection, AccountInfo } from '@solana/web3.js'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

import idl, { Synft } from '../../synft'

const metadataProgramId = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const MPL_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const programId = new PublicKey(idl.metadata.address)

export async function checkValidNFT(mintKey: PublicKey, connection: web3.Connection): Promise<boolean> {
  // if (!wallet.publicKey) return false
  try {
    const data = await connection.getTokenLargestAccounts(mintKey)
    const result = data.value.some((item) => item.uiAmount === 1 && item.decimals === 0)
    return result
  } catch (error) {
    log.warn('checkValidNFT', error)
    return false
  }
}

export async function checkBelongToMe(
  mintKey: PublicKey,
  wallet: WalletContextState,
  connection: web3.Connection,
): Promise<{
  me: boolean
  program: boolean
}> {
  if (!wallet.publicKey) return { me: false, program: false }
  try {
    const data = await connection.getTokenLargestAccounts(mintKey)
    const dataValue = data.value[0]
    log.debug('checkBelongToMe', dataValue)

    if (dataValue.uiAmount !== 1) return { me: false, program: false }

    const mintTokenAccount: Account = await getAccount(connection, dataValue.address)
    if (!mintTokenAccount?.owner) return { me: false, program: false }

    const belong = mintTokenAccount.owner.toString() === wallet.publicKey.toString()

    let hanCopied = false
    if (!belong) {
      const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
        [Buffer.from('synthetic-nft-mint-seed'), mintKey.toBuffer()],
        programId,
      )
      const accountAndCtx: AccountInfo<Buffer> | null = await connection.getAccountInfo(nftMintPDA)
      hanCopied = !!accountAndCtx
    }
    return { me: belong, program: hanCopied }
  } catch (error) {
    log.error(error)
    return { me: false, program: false }
  }
}

// TODO: return any
export async function getInject(
  mint: string | undefined,
  walletPubKey: PublicKey | null,
  connection: web3.Connection,
  program: Program<Synft>,
): Promise<any | null> {
  if (!walletPubKey || !mint) return null
  log.debug('begin getInject')

  try {
    const mintKey = new PublicKey(mint)
    // const data = await connection.getTokenLargestAccounts(mintKey)
    // const mintTokenAccount = await getAccount(connection, data.value[0].address)

    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('children-of'), mintKey.toBuffer()],
      programId,
    )

    const childrenMetadata = await connection.getAccountInfo(metadataPDA)
    if (!childrenMetadata) {
      return null
    }
    let childrenMeta = null
    if (childrenMetadata) {
      childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
    }

    log.debug('getInject', { childrenMetadata, childrenMeta })

    return { childrenMetadata, childrenMeta }
  } catch (error) {
    log.warn(error)
    return null
  }
}

export async function nftCopy(
  mint: string | undefined,
  { name, symbol, uri }: { name: string; symbol: string; uri: string },
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
): Promise<string> {
  if (!wallet.publicKey || !mint) return ''
  log.debug('begin nftCopy')
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
  log.debug('nftCopy result', result, nftTokenAccountPDA.toString(), nftMintPDA.toString())
  return nftMintPDA.toString()
}

export async function injectSol(
  mint: string | undefined,
  solAmount: number,
  reversible: boolean,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.debug('begin injectSol')
  const injectSolAmount = new BN(solAmount)
  const mintKey = new PublicKey(mint)

  const mintTokenAccount = await connection.getTokenLargestAccounts(mintKey)
  const mintTokenAccountAddress = mintTokenAccount.value[0].address

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), mintKey.toBuffer()],
    programId,
  )

  // Inject
  const tx: Transaction = await program.transaction.initializeSolInject(...[reversible, metadataBump, injectSolAmount], {
    accounts: {
      currentOwner: wallet.publicKey,
      parentTokenAccount: mintTokenAccountAddress,
      parentMintAccount: mintKey,
      childrenMeta: metadataPDA,
      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  })
  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('injectSol result', result)
}

export async function extractSol(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.debug('begin extractSol')
  const mintKey = new PublicKey(mint)
  const mintTokenAccount = await connection.getTokenLargestAccounts(mintKey)
  const mintTokenAccountAddress = mintTokenAccount.value[0].address

  // const tokenAccount = await getAccount(connection, mintTokenAccountAddress)

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), mintKey.toBuffer()],
    programId,
  )

  const extractTx = await program.transaction.extractSol(metadataBump, {
    accounts: {
      currentOwner: wallet.publicKey,
      parentTokenAccount: mintTokenAccountAddress,
      parentMintAccount: mintKey,
      childrenMeta: metadataPDA,

      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  })
  const signature = await wallet.sendTransaction(extractTx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('extractSol result', result)
}

export async function injectNFT(
  mint: string | undefined,
  childMint: string,
  reversible: boolean,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint || !childMint) return
  log.debug('begin injectNFT', { childMint, mint })

  const parentMintKey = new PublicKey(mint)
  const parentMintTokenAccounts = await connection.getTokenLargestAccounts(parentMintKey)
  const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), parentMintKey.toBuffer()],
    programId,
  )

  const childMintKey = new PublicKey(childMint)

  const childMintTokenAccounts = await connection.getTokenLargestAccounts(childMintKey)
  const childMintTokenAccountsAddr = childMintTokenAccounts.value[0].address

  // const parentTokenAccount = await getAccount(connection, parentMintTokenAccountAddr)
  // const childTokenAccount = await getAccount(connection, childMintTokenAccountsAddr)

  const tx = await program.transaction.initializeInject(reversible, metadataBump, {
    accounts: {
      currentOwner: wallet.publicKey,
      childTokenAccount: childMintTokenAccountsAddr,
      parentTokenAccount: parentMintTokenAccountAddr,
      parentMintAccount: parentMintKey,
      childrenMeta: metadataPDA,

      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  })
  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('injectNFT result', result)
  const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
  log.debug('injectNFT', { childrenMeta })
}

export async function extractNFT(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.debug('begin extractNFT')

  const parentMintKey = new PublicKey(mint)
  const parentMintTokenAccounts = await connection.getTokenLargestAccounts(parentMintKey)
  const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), parentMintKey.toBuffer()],
    programId,
  )

  const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
  const childTokenAccount = childrenMeta.child

  const tx = await program.transaction.extract(metadataBump, {
    accounts: {
      currentOwner: wallet.publicKey,
      childTokenAccount,
      parentTokenAccount: parentMintTokenAccountAddr,
      parentMintAccount: parentMintKey,
      childrenMeta: metadataPDA,

      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  })
  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('extractNFT result :', result)
}

export async function burnWithdrawSOL(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.debug('begin burnWithdrawSOL')
  const mintKey = new PublicKey(mint)
  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), mintKey.toBuffer()],
    program.programId,
  )
  const parentMintTokenAccounts = await connection.getTokenLargestAccounts(mintKey)
  const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address

  const tx = await program.transaction.burnForSol({
    accounts: {
      currentOwner: wallet.publicKey,
      parentMintAccount: mintKey,
      parentTokenAccount: parentMintTokenAccountAddr,
      childrenMeta: metadataPDA,

      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  })
  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('extractNFT result :', result)
}

export async function burnWithdrawSPL(
  mint: string | undefined,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  if (!wallet.publicKey || !mint) return
  log.debug('begin burnWithdrawSPL')
  const mintKey = new PublicKey(mint)

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('children-of'), mintKey.toBuffer()],
    programId,
  )
  const parentMintTokenAccounts = await connection.getTokenLargestAccounts(mintKey)
  const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address
  const childrenMeta = await program.account.childrenMetadata.fetch(metadataPDA)
  const childTokenAccount = childrenMeta.child

  const tx = await program.transaction.burnForToken({
    accounts: {
      currentOwner: wallet.publicKey,
      parentMintAccount: mintKey,
      parentTokenAccount: parentMintTokenAccountAddr,
      childTokenAccount,
      childrenMeta: metadataPDA,

      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  })

  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  log.debug('burnWithdrawSPL result :', result)
}

export async function loadNFTInject(
  address: PublicKey,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  const childTokenAccount = await getTokenAccount(address, connection)
  const metadata = await getMetadataFromMint(connection, childTokenAccount.mint)
  const inject = await getInject(childTokenAccount.mint.toString(), wallet.publicKey, connection, program)
  return { inject, metadata, childTokenAccount }
}

export async function loadChildrenInject(
  address: PublicKey,
  { wallet, program, connection }: { wallet: WalletContextState; program: Program<Synft>; connection: web3.Connection },
) {
  const metadataArr: any[] = []

  let { inject, childTokenAccount, metadata } = await loadNFTInject(address, { wallet, program, connection })
  metadataArr.push(metadata)

  // TODO: redux
  while (inject) {
    log.debug(`${childTokenAccount.mint.toString()} hasInject`, inject)
    if (inject.childrenMeta?.childType.nft) {
      // eslint-disable-next-line no-await-in-loop
      const data = await loadNFTInject(inject.childrenMeta.child, { wallet, program, connection })
      childTokenAccount = data.childTokenAccount
      metadata = data.metadata
      metadataArr.push(metadata)
      inject = data.inject
    } else if (inject.childrenMeta?.childType.sol) {
      // TODO: get sol count
      metadataArr.push({
        injectType: 'sol',
        lamports: inject.childrenMetadata.lamports,
      })
      inject = null
    } else {
      inject = null
    }
  }

  return metadataArr
}

export async function getTokenAccount(address: PublicKey, connection: Connection) {
  const account = await getAccount(connection, address)
  return account
}

export async function getMetadataFromMint(connection: Connection, mintKey: PublicKey) {
  const pubkey = await Metadata.getPDA(mintKey)
  const metadata = await Metadata.load(connection, pubkey)
  return metadata
}
