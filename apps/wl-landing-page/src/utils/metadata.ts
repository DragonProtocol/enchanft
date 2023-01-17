import { Connection, PublicKey } from '@solana/web3.js';
import {
  Metadata,
  PROGRAM_ID as MetadataProgramId,
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { SynftSeed, SYNFT_PROGRAM_ID } from '@ecnft/js-sdk-react';
import SynftContract from '@ecnft/js-sdk-core';
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';

import type { BelongTo, MetaInfo, Node } from '../synft';

export async function getMetadataFromMint(
  mintKey: PublicKey,
  connection: Connection
) {
  const [pubkey] = await getMetadataPDA(mintKey);
  const info = await connection.getAccountInfo(pubkey);
  if (!info) return null;
  const data = Metadata.fromAccountInfo(info);
  return data[0];
}

export async function getMetadataPDA(mint: PublicKey) {
  const key = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), MetadataProgramId.toBuffer(), mint.toBuffer()],
    MetadataProgramId
  );
  return key;
}

export async function getMetadataInfoWithMint(
  mintKey: PublicKey,
  connection: Connection
): Promise<MetaInfo | null> {
  try {
    const metadata = await getMetadataFromMint(mintKey, connection);
    if (!metadata) return null;
    const externalMetadata = (await axios.get(metadata.data.uri)).data;
    const result = {
      mint: mintKey,
      metadata,
      externalMetadata,
    };
    return result;
  } catch (error) {
    return null;
  }
}

export async function getMintsAccountInfo(
  mints: PublicKey[],
  connection: Connection
) {
  const pdas = await Promise.all(
    mints.map(async (item) => {
      const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
        [Buffer.from(SynftSeed.MINT_SEED), item.toBuffer()],
        SYNFT_PROGRAM_ID
      );
      return nftMintPDA;
    })
  );

  const info = await connection.getMultipleAccountsInfo(pdas);
  return info;
}

export async function getValidNFTokensWithOwner(
  owner: PublicKey,
  connection: Connection
) {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  const filteredToken = tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => ({
      address: new PublicKey(t.pubkey),
      mint: new PublicKey(t.account.data.parsed.info.mint),
    }));
  return filteredToken;
}

export async function getInjectSOLFromMints(
  mints: PublicKey[],
  connection: Connection
) {
  const pdas = await Promise.all(
    mints.map(async (item) => {
      const solPda = await getEnchaSOLPda(item);
      return solPda;
    })
  );
  const infos = await connection.getMultipleAccountsInfo(pdas);
  return infos;
}

export async function getMetadataFormMints(
  mints: PublicKey[],
  connection: Connection
) {
  const pdas = await Promise.all(
    mints.map(async (item) => {
      const [pubkey] = await getMetadataPDA(item);
      return pubkey;
    })
  );
  const infos = await connection.getMultipleAccountsInfo(pdas);
  const datas = await Promise.all(
    infos.map(async (item, index) => {
      if (item === null) return null;
      const data = Metadata.fromAccountInfo(item);
      return data[0];
    })
  );

  return datas;
}

export async function getEnchaSOLPda(mintKey: PublicKey) {
  const [solPDA] = await PublicKey.findProgramAddress(
    [Buffer.from(SynftSeed.SOL), mintKey.toBuffer()],
    SYNFT_PROGRAM_ID
  );

  return solPDA;
}

export async function getInjectSOL(mintKey: PublicKey, connection: Connection) {
  const solPDA = await getEnchaSOLPda(mintKey);
  const solChildrenMetadata = await connection.getAccountInfo(solPDA);
  return solChildrenMetadata;
}

export async function checkValidNFT(
  mintKey: PublicKey,
  connection: Connection
): Promise<boolean> {
  try {
    // 获取有效的 tokenAccount
    const tokenAccountBalancePair = await connection.getTokenLargestAccounts(
      mintKey
    );
    // 满足该条件，才是有效的 NFT
    const valid =
      tokenAccountBalancePair.value[0].uiAmount === 1 &&
      tokenAccountBalancePair.value[0].decimals === 0;
    return valid;
  } catch (error) {
    return false;
  }
}

export async function getInjectTree(
  synftContract: SynftContract,
  mintKey: PublicKey,
  withParent: boolean = true
): Promise<Node | null> {
  const treeObj: Node = {
    curr: {
      mint: mintKey.toString(),
      rootPDA: undefined,
      sol: null,
      children: [],
    },
    parent: null,
  };
  try {
    const solChildrenMetadata = await synftContract.getInjectSOL(mintKey);
    // log.info('inject solChildrenMetadata', solChildrenMetadata)
    if (solChildrenMetadata) {
      treeObj.curr.sol = {
        lamports: solChildrenMetadata.lamports,
        // owner: solChildrenMetadata.owner.toString(),
      };
    }

    // 只需要第一次的时候获取 parent
    if (withParent) {
      const parentNFT = await synftContract.getParentNFT(mintKey);
      // if parentNFT 证明当前是个子节点，有父节点
      if (parentNFT) {
        treeObj.parent = parentNFT;
      }
    }

    const childrenNFT = await synftContract.getInjectChildren(mintKey);
    const children = await Promise.all(
      childrenNFT.map(async (item) => {
        const root = item.account.root.toString();
        const childMint = item.account.child;
        const tree = await getInjectTree(synftContract, childMint, false);
        if (tree) {
          tree.curr.rootPDA = root;
        }
        return tree;
      })
    );
    treeObj.curr.children = children.filter((item) => item !== null) as Node[];
    return treeObj;
  } catch (error) {
    return null;
  }
}

export async function checkBelongTo(
  synftContract: SynftContract,
  mintKey: PublicKey,
  walletPubkey: PublicKey,
  connection: Connection
): Promise<BelongTo> {
  const result: BelongTo = { me: false, program: false, parent: null };
  try {
    // 获取有效的 tokenAccount
    let tokenAccountBalancePair = await connection.getTokenLargestAccounts(
      mintKey
    );
    let lastTokenAccountBalancePair = tokenAccountBalancePair.value[0];
    if (lastTokenAccountBalancePair.uiAmount !== 1) return result;

    let mintTokenAccount = await getAccount(
      connection,
      lastTokenAccountBalancePair.address
    );
    let belongToSelf =
      mintTokenAccount.owner.toString() === walletPubkey.toString();
    result.me = belongToSelf;

    const parentNFT = await synftContract.getParentNFT(mintKey);
    if (parentNFT) {
      result.parent = parentNFT;
      const rootMintKey = new PublicKey(result.parent.rootMint);
      tokenAccountBalancePair = await connection.getTokenLargestAccounts(
        rootMintKey
      );
      // eslint-disable-next-line prefer-destructuring
      lastTokenAccountBalancePair = tokenAccountBalancePair.value[0];
    }

    if (!result.me) {
      mintTokenAccount = await getAccount(
        connection,
        lastTokenAccountBalancePair.address
      );
      belongToSelf =
        mintTokenAccount.owner.toString() === walletPubkey.toString();
      result.me = belongToSelf;
      //-----------------------------
      const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
        [Buffer.from(SynftSeed.MINT_SEED), mintKey.toBuffer()],
        SYNFT_PROGRAM_ID
      );
      const accountAndCtx = await connection.getAccountInfo(nftMintPDA);
      result.program = !!accountAndCtx;
    }
    return result;
  } catch (error) {
    return result;
  }
}
