import {
  PublicKey,
  Connection,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  BN,
  utils,
} from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import idl from "./idl.json";
import type { Synft } from "./synft";

const MPL_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const PROGRAM_ID = new PublicKey(idl.metadata.address);
enum SynftSeed {
  SOL = "sol-seed",
  CHILDREN_OF = "children-of",
  METADATA = "metadata",
  ACCOUNT_SEED = "synthetic-nft-account-seed",
  MINT_SEED = "synthetic-nft-mint-seed",
  PARENT_METADATA = "parent-metadata-seed",
}

export default class SynftContract {
  private _connection: Connection | null = null;
  private _program: Program<Synft> | null = null;

  constructor(connection: Connection) {
    const provider = new AnchorProvider(
      connection,
      (window as any).solana,
      AnchorProvider.defaultOptions()
    );
    const program = new Program(
      idl as any,
      PROGRAM_ID,
      provider
    ) as Program<Synft>;
    this._connection = connection;
    this._program = program;
  }

  public async copyNFTInstruction(
    owner: PublicKey,
    mint: PublicKey,
    {
      name,
      symbol,
      metadataUri,
    }: { name: string; symbol: string; metadataUri: string }
  ): Promise<TransactionInstruction> {
    if (!this._program) {
      throw new Error("Init Contract with connect first");
    }
    const mintKey = mint;
    const program = this._program;

    // 1. 使用 mint 进行 copy
    const [nftMintPDA, _nftMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from(SynftSeed.MINT_SEED), mintKey.toBuffer()],
      PROGRAM_ID
    );

    const [nftTokenAccountPDA, _nftTokenAccountBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from(SynftSeed.ACCOUNT_SEED), mintKey.toBuffer()],
        PROGRAM_ID
      );

    const [nftMetadataPDA, _nftMetadataBump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(SynftSeed.METADATA),
          MPL_PROGRAM_ID.toBuffer(),
          nftMintPDA.toBuffer(),
        ],
        MPL_PROGRAM_ID
      );

    const instructionCopy = program.methods
      .nftCopy(...[name, symbol, metadataUri])
      .accounts({
        currentOwner: owner,
        fromNftMint: mintKey,
        nftMetaDataAccount: nftMetadataPDA,
        nftMintAccount: nftMintPDA,
        nftTokenAccount: nftTokenAccountPDA,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mplProgram: MPL_PROGRAM_ID,
      })
      .instruction();
    return instructionCopy;
  }

  public async injectSOLInstruction(
    owner: PublicKey,
    mintKey: PublicKey,
    solAmount: number
  ): Promise<TransactionInstruction> {
    if (!this._program || !this._connection) {
      throw new Error("Init Contract with connect first");
    }
    const injectSolAmount = new BN(solAmount);
    const mintTokenAccount = await this._connection.getTokenLargestAccounts(
      mintKey
    );
    const mintTokenAccountAddress = mintTokenAccount.value[0].address;

    const [solPDA, solBump] = await PublicKey.findProgramAddress(
      [Buffer.from(SynftSeed.SOL), mintKey.toBuffer()],
      PROGRAM_ID
    );
    const instruction = await this._program.methods
      .injectToSolV2(solBump, injectSolAmount)
      .accounts({
        currentOwner: owner,
        parentTokenAccount: mintTokenAccountAddress,
        parentMintAccount: mintKey,
        solAccount: solPDA,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    return instruction;
  }

  /**
   * 将一个 NFT 注入到另一个 NFT
   * @param owner 所属
   * @param rootMintKey 被注入的 NFT
   * @param children 注入的 NFT，数组。协议支持一下子注入多个
   * @returns
   */
  public async injectNFTToRoot(
    owner: PublicKey,
    rootMintKey: PublicKey,
    children: PublicKey[],
    reversible = true
  ): Promise<TransactionInstruction[]> {
    if (!this._connection || !this._program) {
      throw new Error("Init Contract with connect first");
    }
    if (children.length === 0) {
      throw new Error("children must has one item");
    }
    const program = this._program;
    const connection = this._connection;

    const parentMintTokenAccounts = await connection.getTokenLargestAccounts(
      rootMintKey
    );
    const parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address;

    const [parentPDA, parentBump] = await PublicKey.findProgramAddress(
      [Buffer.from(SynftSeed.PARENT_METADATA), rootMintKey.toBuffer()],
      program.programId
    );

    const instructions = children.map(async (item) => {
      const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(SynftSeed.CHILDREN_OF),
          rootMintKey.toBuffer(),
          item.toBuffer(),
        ],
        program.programId
      );

      const [parentOfChildPDA, parentOfChildBump] =
        await PublicKey.findProgramAddress(
          [Buffer.from(SynftSeed.PARENT_METADATA), item.toBuffer()],
          program.programId
        );

      // 获取 NFT 有效的 tokenAccount
      const childMintTokenAccounts = await connection.getTokenLargestAccounts(
        item
      );
      const childMintTokenAccountsAddr =
        childMintTokenAccounts.value[0].address;

      const instruction = await program.methods
        .injectToRootV2(reversible, metadataBump, parentBump, parentOfChildBump)
        .accounts({
          currentOwner: owner,
          childTokenAccount: childMintTokenAccountsAddr,
          childMintAccount: item,
          parentTokenAccount: parentMintTokenAccountAddr,
          parentMintAccount: rootMintKey,
          childrenMeta: metadataPDA,
          parentMeta: parentPDA,
          parentMetaOfChild: parentOfChildPDA,

          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([])
        .instruction();
      return instruction;
    });
    const instructionTx = await Promise.all(instructions);

    return instructionTx;
  }

  /**
   * 将 children NFT 注入到 mint NFT
   * @param owner 所属
   * @param mintKey 被注入的 NFT 的 mint
   * @param childrenMint 注入的 NFT，数组。协议支持一下注入多个
   * @param { parentMintKey, rootPDA } 注入非 root NFT需要提供被注入的 root 信息
   * @returns
   */
  public async injectNFTToNonRoot(
    owner: PublicKey,
    mintKey: PublicKey, // mint4
    childrenMint: PublicKey[], // mint5
    rootPDA: PublicKey,
    reversible = true
  ) {
    if (!this._connection || !this._program) {
      throw new Error("Init Contract with connect first");
    }
    if (childrenMint.length === 0) {
      throw new Error("childrenMint must has one item");
    }

    const program = this._program;
    const connection = this._connection;

    const rootMeta = await program.account.childrenMetadataV2.fetch(rootPDA);
    const rootMintKey = rootMeta.parent;
    const rootMintTokenAccounts = await connection.getTokenLargestAccounts(
      rootMintKey
    );
    const rootMintTokenAccountAddr = rootMintTokenAccounts.value[0].address;

    const [rootMetadataPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from(SynftSeed.CHILDREN_OF),
        rootMintKey.toBuffer(),
        mintKey.toBuffer(),
      ],
      PROGRAM_ID
    );

    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from(SynftSeed.PARENT_METADATA), mintKey.toBuffer()],
      PROGRAM_ID
    );

    const mintTokenAccounts = await connection.getTokenLargestAccounts(mintKey);
    const mintTokenAccountAddr = mintTokenAccounts.value[0].address;

    const instructions = childrenMint.map(async (item) => {
      const [childMetadataPDA, childMetadataBump] =
        await PublicKey.findProgramAddress(
          [
            Buffer.from(SynftSeed.CHILDREN_OF),
            mintKey.toBuffer(),
            item.toBuffer(),
          ],
          PROGRAM_ID
        );

      const [itemParentMetadataPDA, _itemParentMetadataBump] =
        await PublicKey.findProgramAddress(
          [
            Buffer.from(utils.bytes.utf8.encode(SynftSeed.PARENT_METADATA)),
            item.toBuffer(),
          ],
          program.programId
        );

      const childMintTokenAccounts = await connection.getTokenLargestAccounts(
        item
      );
      const childMintTokenAccountAddr = childMintTokenAccounts.value[0].address;

      const instruction = await program.methods
        .injectToNonRootV2(reversible, childMetadataBump, metadataBump)
        .accounts({
          currentOwner: owner,
          childTokenAccount: childMintTokenAccountAddr,
          childMintAccount: item,
          parentTokenAccount: mintTokenAccountAddr,
          parentMintAccount: mintKey,
          rootTokenAccount: rootMintTokenAccountAddr,
          rootMintAccount: rootMintKey,
          childrenMeta: childMetadataPDA,
          childrenMetaOfParent: rootMetadataPDA,
          parentMeta: metadataPDA,
          rootMeta: rootPDA,
          parentMetaOfChild: itemParentMetadataPDA,

          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
      return instruction;
    });
    const instructionTx = await Promise.all(instructions);
    return instructionTx;
  }
}
