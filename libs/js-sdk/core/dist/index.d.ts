/// <reference types="node" />
import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
import { Program, web3 } from "@project-serum/anchor";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import type { Synft } from "./synft";
export declare const PROGRAM_ID: PublicKey;
export declare enum SynftSeed {
    SOL = "sol-seed",
    CHILDREN_OF = "children-of",
    METADATA = "metadata",
    ACCOUNT_SEED = "synthetic-nft-account-seed",
    MINT_SEED = "synthetic-nft-mint-seed",
    PARENT_METADATA = "parent-metadata-seed"
}
export declare type MetaInfo = {
    mint: PublicKey;
    metadata: Metadata;
    externalMetadata: any;
};
export default class SynftContract {
    private _connection;
    program: Program<Synft> | null;
    constructor(connection: Connection);
    copyNFTInstruction(owner: PublicKey, mint: PublicKey, { name, symbol, metadataUri, }: {
        name: string;
        symbol: string;
        metadataUri: string;
    }): Promise<TransactionInstruction>;
    injectSOLInstruction(owner: PublicKey, mintKey: PublicKey, solAmount: number): Promise<TransactionInstruction>;
    injectSOLWithTokenAccountInstruction(owner: PublicKey, mintKey: PublicKey, tokenAccount: PublicKey, solAmount: number): Promise<TransactionInstruction>;
    /**
     * 将一个 NFT 注入到另一个 NFT
     * @param owner 所属
     * @param rootMintKey 被注入的 NFT
     * @param children 注入的 NFT，数组。协议支持一下子注入多个
     * @returns
     */
    injectNFTToRoot(owner: PublicKey, rootMintKey: PublicKey, children: PublicKey[], reversible?: boolean): Promise<TransactionInstruction[]>;
    /**
     * 将 children NFT 注入到 mint NFT
     * @param owner 所属
     * @param mintKey 被注入的 NFT 的 mint
     * @param childrenMint 注入的 NFT，数组。协议支持一下注入多个
     * @param { parentMintKey, rootPDA } 注入非 root NFT需要提供被注入的 root 信息
     * @returns
     */
    injectNFTToNonRoot(owner: PublicKey, mintKey: PublicKey, // mint4
    childrenMint: PublicKey[], // mint5
    rootPDA: PublicKey, reversible?: boolean): Promise<TransactionInstruction[]>;
    /**
     * 将注入的 SOL 提取出来
     * @param mintKey 被注入的 NFT 的 mint
     * @param walletPubKey 钱包的 PubKey
     * @returns Promise<TransactionInstruction>
     */
    extractSOL(mintKey: PublicKey, walletPubKey: PublicKey): Promise<TransactionInstruction>;
    extractChildNFTToUser(walletPubKey: PublicKey, receiver: PublicKey, mintKey: PublicKey, // mint4
    { parentMintKey, // mint3
    rootMintKey, }: {
        parentMintKey: PublicKey;
        rootMintKey: PublicKey;
    }): Promise<TransactionInstruction>;
    burn(walletPubKey: PublicKey, mintKey: PublicKey): Promise<TransactionInstruction>;
    getRootMintFromRootPDA(pda: string): Promise<PublicKey>;
    getParentNFT(mintKey: PublicKey): Promise<{
        mint: string;
        rootPDA: string;
        isMutated: boolean;
        rootMint: string;
    } | null>;
    getInjectChildren(mintKey: PublicKey): Promise<import("@project-serum/anchor").ProgramAccount<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "childrenMetadata";
        type: {
            kind: "struct";
            fields: [{
                name: "child";
                type: "publicKey";
            }, {
                name: "parent";
                type: "publicKey";
            }, {
                name: "root";
                type: "publicKey";
            }, {
                name: "isMutable";
                type: "bool";
            }, {
                name: "isBurnt";
                type: "bool";
            }, {
                name: "isMutated";
                type: "bool";
            }, {
                name: "childType";
                type: {
                    defined: "ChildType";
                };
            }, {
                name: "bump";
                type: "u8";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "crankMetadata";
        type: {
            kind: "struct";
            fields: [{
                name: "tranferedNft";
                type: "publicKey";
            }, {
                name: "oldChildrenRootMetaData";
                type: "publicKey";
            }, {
                name: "closedChildrenMetaData";
                type: "publicKey";
            }, {
                name: "notProcessedChildren";
                type: {
                    array: ["publicKey", 8];
                };
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "parentMetadata";
        type: {
            kind: "struct";
            fields: [{
                name: "bump";
                type: "u8";
            }, {
                name: "isBurnt";
                type: "bool";
            }, {
                name: "height";
                type: "u8";
            }, {
                name: "selfMint";
                type: "publicKey";
            }, {
                name: "immediateChildren";
                type: {
                    array: ["publicKey", 3];
                };
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "solAccount";
        type: {
            kind: "struct";
            fields: [{
                name: "bump";
                type: "u8";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "newRootInfo";
        type: {
            kind: "struct";
            fields: [{
                name: "branchFinished";
                type: "u32";
            }, {
                name: "root";
                type: "publicKey";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "branchInfo";
        type: {
            kind: "struct";
            fields: [{
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    } | {
        name: "rootOwner";
        type: {
            kind: "struct";
            fields: [{
                name: "owner";
                type: "publicKey";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<Synft>>>[]>;
    getInjectSOL(mintKey: PublicKey): Promise<web3.AccountInfo<Buffer> | null>;
    checkHasInject(mintKey: PublicKey): Promise<{
        hasInjected: boolean;
        hasInjectedSOL: boolean;
        hasInjectedNFT: boolean;
    }>;
}
