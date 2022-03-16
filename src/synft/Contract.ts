/* eslint-disable no-unreachable */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-underscore-dangle */

import { PublicKey, Connection, AccountInfo, SystemProgram, Transaction } from '@solana/web3.js'
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import { BN, Program, Provider, web3 } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, getAccount, Account } from '@solana/spl-token'
import { WalletContextState } from '@solana/wallet-adapter-react'
import axios from 'axios'
import log from 'loglevel'

import idl, { Synft } from './v2'
import type { Node, MetaInfo, BelongTo } from './v2/types'

const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const MPL_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const PROGRAM_ID = new PublicKey(idl.metadata.address)

const SOL_SEED = 'sol-seed'
const CHILDREN_OF = 'children-of'
const PARENT_OFFSET = 40 // 8(anchor) + 32(pubkey)
const CHILD_OFFSET = 8 // 8(anchor)

export default class Contract {
  private static _instance: Contract = new Contract()

  private _wallet: WalletContextState | null = null
  private _connection: Connection | null = null
  private _program: Program<Synft> | null = null

  constructor() {
    if (Contract._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.')
    }
    Contract._instance = this
  }

  public static getInstance(): Contract {
    return Contract._instance
  }

  private initProgram(connection: Connection) {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, PROGRAM_ID, provider) as Program<Synft>
    this._program = program
  }

  public setWallet(wallet: WalletContextState) {
    this._wallet = wallet
  }

  public setConnection(conn: Connection) {
    this._connection = conn
    this.initProgram(conn)
    log.info('Contract initProgram')
  }

  public async checkValidNFT(mintKey: PublicKey): Promise<boolean> {
    log.info('checkValidNFT')

    if (!this._connection) {
      log.error('Contract connect invalid')
      return false
    }
    try {
      const data = await this._connection.getTokenLargestAccounts(mintKey)
      const result = data.value.some((item) => item.uiAmount === 1 && item.decimals === 0)
      return result
    } catch (error) {
      log.warn('checkValidNFT', error)
      return false
    }
  }

  public async checkBelongTo(mintKey: PublicKey): Promise<BelongTo> {
    log.info('checkBelongTo')

    const result = { me: false, program: false }
    if (!this._connection) {
      log.error('Contract connect invalid')
      return result
    }
    try {
      const tokenAccountBalancePair = await this._connection.getTokenLargestAccounts(mintKey)
      const lastTokenAccountBalancePair = tokenAccountBalancePair.value[0]
      if (lastTokenAccountBalancePair.uiAmount !== 1) return result

      const mintTokenAccount = await getAccount(this._connection, lastTokenAccountBalancePair.address)
      const belongToSelf = mintTokenAccount.owner.toString() === this._wallet?.publicKey?.toString()
      result.me = belongToSelf

      if (!belongToSelf) {
        const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
          [Buffer.from('synthetic-nft-mint-seed'), mintKey.toBuffer()],
          PROGRAM_ID,
        )
        const accountAndCtx: AccountInfo<Buffer> | null = await this._connection.getAccountInfo(nftMintPDA)
        result.program = !!accountAndCtx
      }
      return result
    } catch (error) {
      log.warn(error)
      return result
    }
  }

  // 获取 mint 的上下 tree
  public async getInjectTree(mintKey: PublicKey, first: boolean = true): Promise<any | null> {
    if (!this._connection || !this._program) {
      log.error('Contract connect invalid')
      return null
    }
    const treeObj: Node = {
      curr: {
        mint: mintKey.toString(),
        sol: null,
        children: [],
      },
      parent: null,
    }
    try {
      const [solPDA] = await PublicKey.findProgramAddress([Buffer.from(SOL_SEED), mintKey.toBuffer()], PROGRAM_ID)
      const solChildrenMetadata = await this._connection.getAccountInfo(solPDA)
      // log.info('inject solChildrenMetadata', solChildrenMetadata)
      if (solChildrenMetadata) {
        treeObj.curr.sol = {
          lamports: solChildrenMetadata.lamports,
          // owner: solChildrenMetadata.owner.toString(),
        }
      }

      // 只需要第一次的时候获取 parent
      if (first) {
        const parentNFT = await this._program.account.childrenMetadataV2.all([
          {
            memcmp: {
              offset: CHILD_OFFSET,
              bytes: mintKey.toBase58(),
            },
          },
        ])
        // if parentNFT 证明当前是个子节点，有父节点
        if (parentNFT[0]) {
          treeObj.parent = {
            mint: parentNFT[0]?.account.parent.toString(),
            rootPDA: parentNFT[0]?.account.root.toString(),
          }
        }
      }

      const filter = [
        {
          memcmp: {
            offset: PARENT_OFFSET,
            bytes: mintKey.toBase58(),
          },
        },
      ]

      const childrenNFT = await this._program.account.childrenMetadataV2.all(filter)
      const children = await Promise.all(
        childrenNFT.map(async (item) => {
          const childMint = item.account.child
          const tree = await this.getInjectTree(childMint, false)
          return tree
        }),
      )
      treeObj.curr.children = children
      return treeObj
    } catch (error) {
      log.warn(error)
      return null
    }
  }

  /**
   * externalMetadata any, json data
   */
  public async getMetadataWithMint(mintKey: PublicKey): Promise<MetaInfo | null> {
    if (!this._connection || !this._program) {
      log.error('Contract connect invalid')
      return null
    }
    try {
      const pubkey = await Metadata.getPDA(mintKey)
      const metadata = (await Metadata.load(this._connection, pubkey)).data
      const externalMetadata = (await axios.get(metadata.data.uri)).data
      return {
        mint: mintKey,
        metadata,
        externalMetadata,
      }
    } catch (error) {
      log.error(error)
      return null
    }
  }

  public async injectSOL(mintKey: PublicKey, solAmount: number): Promise<void> {
    log.info('injectSOL')
    if (!this._connection || !this._program || !this._wallet?.publicKey) {
      log.error('Contract connect invalid')
      return
    }
    const injectSolAmount = new BN(solAmount)
    const mintTokenAccount = await this._connection.getTokenLargestAccounts(mintKey)
    const mintTokenAccountAddress = mintTokenAccount.value[0].address

    const [solPDA, solBump] = await PublicKey.findProgramAddress(
      [Buffer.from(SOL_SEED), mintKey.toBuffer()],
      PROGRAM_ID,
    )
    const initTx = await this._program.transaction.injectToSolV2(solBump, injectSolAmount, {
      accounts: {
        currentOwner: this._wallet.publicKey,
        parentTokenAccount: mintTokenAccountAddress,
        parentMintAccount: mintKey,
        solAccount: solPDA,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [],
    })
    const signature = await this._wallet.sendTransaction(initTx, this._connection)
    const result = await this._connection.confirmTransaction(signature, 'processed')
    // { "context": { "slot": 121298588 }, "value": { "err": null} }
    log.debug('injectSol result', result)
  }

  public async injectNFTToRoot(rootMintKey: PublicKey, children: PublicKey[]) {
    log.info('injectNFTToRoot: ', rootMintKey.toString())
    if (!this._connection || !this._program || !this._wallet?.publicKey) {
      log.error('Contract connect invalid')
      return
    }
    if (children.length === 0) {
      return
    }
    const program = this._program
    const walletPubKey = this._wallet.publicKey
    const connection = this._connection

    const parentMintTokenAccounts = await connection.getTokenLargestAccounts(rootMintKey)
    const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address

    const instructions = children.map(async (item) => {
      const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
        [Buffer.from(CHILDREN_OF), rootMintKey.toBuffer(), item.toBuffer()],
        PROGRAM_ID,
      )

      const childMintTokenAccounts = await connection.getTokenLargestAccounts(item)
      const childMintTokenAccountsAddr = childMintTokenAccounts.value[0].address

      const instruction = await program.instruction.injectToRootV2(true, metadataBump, {
        accounts: {
          currentOwner: walletPubKey,
          childTokenAccount: childMintTokenAccountsAddr,
          childMintAccount: item,
          parentTokenAccount: parentMintTokenAccountAddr,
          parentMintAccount: rootMintKey,
          childrenMeta: metadataPDA,

          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [],
      })
      return instruction
    })
    const instructionTx = await Promise.all(instructions)

    const tx = new Transaction().add(...instructionTx)
    const signature = await this._wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    log.info('nftCopyWithInject', result)
  }

  public async injectNFTToNonRoot(
    mintKey: PublicKey, // mint4
    childrenMint: PublicKey[], // mint5
    {
      parentMintKey, // mint3
      rootPDA,
    }: {
      parentMintKey: PublicKey
      rootPDA: PublicKey
    },
  ) {
    log.info('injectNFTToNonRoot: ', {
      mintKey: mintKey.toString(),
      parentMintKey: parentMintKey.toString(),
    })
    if (!this._connection || !this._program || !this._wallet?.publicKey) {
      log.error('Contract connect invalid')
      return
    }
    if (childrenMint.length === 0) {
      return
    }
    const program = this._program
    const walletPubKey = this._wallet.publicKey
    const connection = this._connection

    const rootMeta = await program.account.childrenMetadataV2.fetch(rootPDA)
    const rootMintKey = rootMeta.parent
    const rootMintTokenAccounts = await connection.getTokenLargestAccounts(rootMintKey)
    const rootMintTokenAccountAddr = rootMintTokenAccounts.value[0].address

    const [rootMetadataPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(CHILDREN_OF), rootMintKey.toBuffer(), mintKey.toBuffer()],
      PROGRAM_ID,
    )
    log.info({ rootMint: rootMintKey.toString(), rootMetadataPDA: rootMetadataPDA.toString() })

    // const parentMintTokenAccounts = await connection.getTokenLargestAccounts(parentMintKey)
    // const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address
    const [parentMetadataPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(CHILDREN_OF), parentMintKey.toBuffer(), mintKey.toBuffer()],
      PROGRAM_ID,
    )

    const mintTokenAccounts = await connection.getTokenLargestAccounts(mintKey)
    const mintTokenAccountAddr = mintTokenAccounts.value[0].address

    const instructions = childrenMint.map(async (item) => {
      const [childMetadataPDA, childMetadataBump] = await PublicKey.findProgramAddress(
        [Buffer.from(CHILDREN_OF), mintKey.toBuffer(), item.toBuffer()],
        PROGRAM_ID,
      )

      const childMintTokenAccounts = await connection.getTokenLargestAccounts(item)
      const childMintTokenAccountAddr = childMintTokenAccounts.value[0].address

      log.info('childMintTokenAccounts', childMintTokenAccounts, childMintTokenAccountAddr)
      log.info({
        currentOwner: walletPubKey.toString(),
        childTokenAccount: childMintTokenAccountAddr.toString(),
        childMintAccount: item.toString(),
        parentTokenAccount: mintTokenAccountAddr.toString(),
        parentMintAccount: mintKey.toString(),
        rootTokenAccount: rootMintTokenAccountAddr.toString(),
        rootMintAccount: rootMintKey.toString(),
        childrenMeta: childMetadataPDA.toString(),
        parentMeta: parentMetadataPDA.toString(),
        rootMeta: rootPDA.toString(),
      })

      const instruction = await program.instruction.injectToNonRootV2(true, false, childMetadataBump, {
        accounts: {
          currentOwner: walletPubKey,
          childTokenAccount: childMintTokenAccountAddr,
          childMintAccount: item,
          parentTokenAccount: mintTokenAccountAddr,
          parentMintAccount: mintKey,
          rootTokenAccount: rootMintTokenAccountAddr,
          rootMintAccount: rootMintKey,
          childrenMeta: childMetadataPDA,
          parentMeta: parentMetadataPDA,
          rootMeta: rootPDA,

          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [],
      })
      return instruction
    })
    const instructionTx = await Promise.all(instructions)
    const tx = new Transaction().add(...instructionTx)
    const signature = await this._wallet.sendTransaction(tx, connection)
    const result = await connection.confirmTransaction(signature, 'processed')
    log.info('injectNFTToNonRoot', result)
  }
}
