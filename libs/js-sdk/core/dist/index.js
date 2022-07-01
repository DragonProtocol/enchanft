'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var web3_js = require('@solana/web3.js');
var anchor = require('@project-serum/anchor');
var splToken = require('@solana/spl-token');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var version = "0.1.0";
var name = "synft";
var instructions = [
	{
		name: "nftCopy",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "fromNftMint",
				isMut: false,
				isSigner: false
			},
			{
				name: "nftMetaDataAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "nftMintAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "nftTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "mplProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "name",
				type: "string"
			},
			{
				name: "symbol",
				type: "string"
			},
			{
				name: "uri",
				type: "string"
			}
		]
	},
	{
		name: "injectToRoot",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "childTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "parentTokenAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "parentMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childrenMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetaOfChild",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "isMutable",
				type: "bool"
			},
			{
				name: "childMetaBump",
				type: "u8"
			},
			{
				name: "parentMetaBump",
				type: "u8"
			},
			{
				name: "parentMetaOfChildBump",
				type: "u8"
			}
		]
	},
	{
		name: "injectToNonRoot",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "childTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "parentTokenAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "parentMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "rootTokenAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "rootMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childrenMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetaOfParent",
				isMut: false,
				isSigner: false
			},
			{
				name: "rootMeta",
				isMut: false,
				isSigner: false
			},
			{
				name: "parentMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetaOfChild",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "isMutable",
				type: "bool"
			},
			{
				name: "childBump",
				type: "u8"
			},
			{
				name: "parentBump",
				type: "u8"
			}
		]
	},
	{
		name: "injectToSol",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "solAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "bump",
				type: "u8"
			},
			{
				name: "injectSolAmount",
				type: "u64"
			}
		]
	},
	{
		name: "transferChildNft",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "rootMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "rootTokenAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "rootMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childrenMetaOfParent",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "receiverAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "bump",
				type: "u8"
			}
		]
	},
	{
		name: "extractSol",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "solAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			}
		],
		args: [
			{
				name: "bump",
				type: "u8"
			}
		]
	},
	{
		name: "transferCrankInit",
		accounts: [
			{
				name: "operator",
				isMut: true,
				isSigner: true
			},
			{
				name: "childMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childrenMetaOfParent",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetaOfRoot",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetaOfParent",
				isMut: true,
				isSigner: false
			},
			{
				name: "crankMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "transferCrankProcess",
		accounts: [
			{
				name: "operator",
				isMut: true,
				isSigner: true
			},
			{
				name: "childMintAccount",
				isMut: false,
				isSigner: false
			},
			{
				name: "childrenMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetaOfParent",
				isMut: true,
				isSigner: false
			},
			{
				name: "crankMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "transferCrankEnd",
		accounts: [
			{
				name: "operator",
				isMut: true,
				isSigner: true
			},
			{
				name: "childrenMetaOfRoot",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetaOfClose",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "crankMeta",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "startBurn",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentMintAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentTokenAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "solAccount",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootOwner",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "startBranch",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "childToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "grandsonMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "grandsonMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "grandsonChildrenMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "crankMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "newRootInfo",
				isMut: true,
				isSigner: false
			},
			{
				name: "branchInfo",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootOwner",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "updateBranch",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "newRootMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "newRootToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "newRootMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "rootChildrenMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "grandsonMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "crankMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "newRootInfo",
				isMut: true,
				isSigner: false
			},
			{
				name: "branchInfo",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootOwner",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	},
	{
		name: "dealSingleNewRoot",
		accounts: [
			{
				name: "currentOwner",
				isMut: true,
				isSigner: true
			},
			{
				name: "parentToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "childToken",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMint",
				isMut: true,
				isSigner: false
			},
			{
				name: "parentMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "childMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "childrenMetadata",
				isMut: true,
				isSigner: false
			},
			{
				name: "oldRootOwner",
				isMut: true,
				isSigner: false
			},
			{
				name: "systemProgram",
				isMut: false,
				isSigner: false
			},
			{
				name: "rent",
				isMut: false,
				isSigner: false
			},
			{
				name: "tokenProgram",
				isMut: false,
				isSigner: false
			}
		],
		args: [
		]
	}
];
var accounts = [
	{
		name: "ChildrenMetadata",
		type: {
			kind: "struct",
			fields: [
				{
					name: "child",
					type: "publicKey"
				},
				{
					name: "parent",
					type: "publicKey"
				},
				{
					name: "root",
					type: "publicKey"
				},
				{
					name: "isMutable",
					type: "bool"
				},
				{
					name: "isBurnt",
					type: "bool"
				},
				{
					name: "isMutated",
					type: "bool"
				},
				{
					name: "childType",
					type: {
						defined: "ChildType"
					}
				},
				{
					name: "bump",
					type: "u8"
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "CrankMetadata",
		type: {
			kind: "struct",
			fields: [
				{
					name: "tranferedNft",
					type: "publicKey"
				},
				{
					name: "oldChildrenRootMetaData",
					type: "publicKey"
				},
				{
					name: "closedChildrenMetaData",
					type: "publicKey"
				},
				{
					name: "notProcessedChildren",
					type: {
						array: [
							"publicKey",
							8
						]
					}
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "ParentMetadata",
		type: {
			kind: "struct",
			fields: [
				{
					name: "bump",
					type: "u8"
				},
				{
					name: "isBurnt",
					type: "bool"
				},
				{
					name: "height",
					type: "u8"
				},
				{
					name: "selfMint",
					type: "publicKey"
				},
				{
					name: "immediateChildren",
					type: {
						array: [
							"publicKey",
							3
						]
					}
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "SolAccount",
		type: {
			kind: "struct",
			fields: [
				{
					name: "bump",
					type: "u8"
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "NewRootInfo",
		type: {
			kind: "struct",
			fields: [
				{
					name: "branchFinished",
					type: "u32"
				},
				{
					name: "root",
					type: "publicKey"
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "BranchInfo",
		type: {
			kind: "struct",
			fields: [
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	},
	{
		name: "RootOwner",
		type: {
			kind: "struct",
			fields: [
				{
					name: "owner",
					type: "publicKey"
				},
				{
					name: "reserved",
					type: {
						array: [
							"u8",
							64
						]
					}
				}
			]
		}
	}
];
var types = [
	{
		name: "ChildType",
		type: {
			kind: "enum",
			variants: [
				{
					name: "SOL"
				},
				{
					name: "SPL"
				},
				{
					name: "NFT"
				}
			]
		}
	}
];
var errors = [
	{
		code: 6000,
		name: "InvalidMetadataBump",
		msg: "The bump passed in does not match the bump in the PDA"
	},
	{
		code: 6001,
		name: "InvalidAuthority",
		msg: "Current owner is not the authority of the parent token"
	},
	{
		code: 6002,
		name: "InvalidExtractAttempt",
		msg: "Only Reversible Synthetic Tokens can be extracted"
	},
	{
		code: 6003,
		name: "InvalidBurnType",
		msg: "Wrong type of burn instruction for the token"
	},
	{
		code: 6004,
		name: "InvalidTransferCrankProcess",
		msg: "Wrong opration of crank process instruction for the token"
	},
	{
		code: 6005,
		name: "InvalidTransferCrankEnd",
		msg: "Wrong opration of crank end instruction for the token"
	}
];
var metadata = {
	address: "nftNZSYP2LiWYW4zDdcNwimx6jWjJ8FnfN71o1ukd4p"
};
var idl = {
	version: version,
	name: name,
	instructions: instructions,
	accounts: accounts,
	types: types,
	errors: errors,
	metadata: metadata
};

// import axios from "axios";
var PARENT_OFFSET = 40; // 8(anchor) + 32(pubkey)
var CHILD_OFFSET = 8; // 8(anchor)
var MPL_PROGRAM_ID = new web3_js.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
var PROGRAM_ID = new web3_js.PublicKey(idl.metadata.address);
exports.SynftSeed = void 0;
(function (SynftSeed) {
    SynftSeed["SOL"] = "sol-seed";
    SynftSeed["CHILDREN_OF"] = "children-of";
    SynftSeed["METADATA"] = "metadata";
    SynftSeed["ACCOUNT_SEED"] = "synthetic-nft-account-seed";
    SynftSeed["MINT_SEED"] = "synthetic-nft-mint-seed";
    SynftSeed["PARENT_METADATA"] = "parent-metadata-seed";
})(exports.SynftSeed || (exports.SynftSeed = {}));
var SynftContract = /** @class */ (function () {
    function SynftContract(connection) {
        this._connection = null;
        this.program = null;
        var provider = new anchor.AnchorProvider(connection, {}, anchor.AnchorProvider.defaultOptions());
        var program = new anchor.Program(idl, PROGRAM_ID, provider);
        this._connection = connection;
        this.program = program;
    }
    SynftContract.prototype.copyNFTInstruction = function (owner, mint, _a) {
        var name = _a.name, symbol = _a.symbol, metadataUri = _a.metadataUri;
        return __awaiter(this, void 0, void 0, function () {
            var mintKey, program, _b, nftMintPDA, _c, nftTokenAccountPDA, _d, nftMetadataPDA, instructionCopy;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        mintKey = mint;
                        program = this.program;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.MINT_SEED), mintKey.toBuffer()], PROGRAM_ID)];
                    case 1:
                        _b = _f.sent(), nftMintPDA = _b[0], _b[1];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.ACCOUNT_SEED), mintKey.toBuffer()], PROGRAM_ID)];
                    case 2:
                        _c = _f.sent(), nftTokenAccountPDA = _c[0], _c[1];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                Buffer.from(exports.SynftSeed.METADATA),
                                MPL_PROGRAM_ID.toBuffer(),
                                nftMintPDA.toBuffer(),
                            ], MPL_PROGRAM_ID)];
                    case 3:
                        _d = _f.sent(), nftMetadataPDA = _d[0], _d[1];
                        instructionCopy = (_e = program.methods)
                            .nftCopy.apply(_e, [name, symbol, metadataUri]).accounts({
                            currentOwner: owner,
                            fromNftMint: mintKey,
                            nftMetaDataAccount: nftMetadataPDA,
                            nftMintAccount: nftMintPDA,
                            nftTokenAccount: nftTokenAccountPDA,
                            systemProgram: web3_js.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            tokenProgram: splToken.TOKEN_PROGRAM_ID,
                            mplProgram: MPL_PROGRAM_ID,
                        })
                            .instruction();
                        return [2 /*return*/, instructionCopy];
                }
            });
        });
    };
    SynftContract.prototype.injectSOLInstruction = function (owner, mintKey, solAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var injectSolAmount, mintTokenAccount, mintTokenAccountAddress, _a, solPDA, solBump, instruction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.program || !this._connection) {
                            throw new Error("Init Contract with connect first");
                        }
                        injectSolAmount = new anchor.BN(solAmount);
                        return [4 /*yield*/, this._connection.getTokenLargestAccounts(mintKey)];
                    case 1:
                        mintTokenAccount = _b.sent();
                        mintTokenAccountAddress = mintTokenAccount.value[0].address;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.SOL), mintKey.toBuffer()], PROGRAM_ID)];
                    case 2:
                        _a = _b.sent(), solPDA = _a[0], solBump = _a[1];
                        return [4 /*yield*/, this.program.methods
                                .injectToSol(solBump, injectSolAmount)
                                .accounts({
                                currentOwner: owner,
                                parentTokenAccount: mintTokenAccountAddress,
                                parentMintAccount: mintKey,
                                solAccount: solPDA,
                                systemProgram: web3_js.SystemProgram.programId,
                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            })
                                .instruction()];
                    case 3:
                        instruction = _b.sent();
                        return [2 /*return*/, instruction];
                }
            });
        });
    };
    SynftContract.prototype.injectSOLWithTokenAccountInstruction = function (owner, mintKey, tokenAccount, solAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var injectSolAmount, _a, solPDA, solBump, instruction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.program || !this._connection) {
                            throw new Error("Init Contract with connect first");
                        }
                        injectSolAmount = new anchor.BN(solAmount);
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.SOL), mintKey.toBuffer()], PROGRAM_ID)];
                    case 1:
                        _a = _b.sent(), solPDA = _a[0], solBump = _a[1];
                        return [4 /*yield*/, this.program.methods
                                .injectToSol(solBump, injectSolAmount)
                                .accounts({
                                currentOwner: owner,
                                parentTokenAccount: tokenAccount,
                                parentMintAccount: mintKey,
                                solAccount: solPDA,
                                systemProgram: web3_js.SystemProgram.programId,
                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            })
                                .instruction()];
                    case 2:
                        instruction = _b.sent();
                        return [2 /*return*/, instruction];
                }
            });
        });
    };
    /**
     * 将一个 NFT 注入到另一个 NFT
     * @param owner 所属
     * @param rootMintKey 被注入的 NFT
     * @param children 注入的 NFT，数组。协议支持一下子注入多个
     * @returns
     */
    SynftContract.prototype.injectNFTToRoot = function (owner, rootMintKey, children, reversible) {
        if (reversible === void 0) { reversible = true; }
        return __awaiter(this, void 0, void 0, function () {
            var program, connection, parentMintTokenAccounts, parentMintTokenAccountAddr, _a, parentPDA, parentBump, instructions, instructionTx;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        if (children.length === 0) {
                            throw new Error("children must has one item");
                        }
                        program = this.program;
                        connection = this._connection;
                        return [4 /*yield*/, connection.getTokenLargestAccounts(rootMintKey)];
                    case 1:
                        parentMintTokenAccounts = _b.sent();
                        parentMintTokenAccountAddr = parentMintTokenAccounts.value[0].address;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.PARENT_METADATA), rootMintKey.toBuffer()], program.programId)];
                    case 2:
                        _a = _b.sent(), parentPDA = _a[0], parentBump = _a[1];
                        instructions = children.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, metadataPDA, metadataBump, _b, parentOfChildPDA, parentOfChildBump, childMintTokenAccounts, childMintTokenAccountsAddr, instruction;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                            Buffer.from(exports.SynftSeed.CHILDREN_OF),
                                            rootMintKey.toBuffer(),
                                            item.toBuffer(),
                                        ], program.programId)];
                                    case 1:
                                        _a = _c.sent(), metadataPDA = _a[0], metadataBump = _a[1];
                                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.PARENT_METADATA), item.toBuffer()], program.programId)];
                                    case 2:
                                        _b = _c.sent(), parentOfChildPDA = _b[0], parentOfChildBump = _b[1];
                                        return [4 /*yield*/, connection.getTokenLargestAccounts(item)];
                                    case 3:
                                        childMintTokenAccounts = _c.sent();
                                        childMintTokenAccountsAddr = childMintTokenAccounts.value[0].address;
                                        return [4 /*yield*/, program.methods
                                                .injectToRoot(reversible, metadataBump, parentBump, parentOfChildBump)
                                                .accounts({
                                                currentOwner: owner,
                                                childTokenAccount: childMintTokenAccountsAddr,
                                                childMintAccount: item,
                                                parentTokenAccount: parentMintTokenAccountAddr,
                                                parentMintAccount: rootMintKey,
                                                childrenMeta: metadataPDA,
                                                parentMeta: parentPDA,
                                                parentMetaOfChild: parentOfChildPDA,
                                                systemProgram: web3_js.SystemProgram.programId,
                                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                                                tokenProgram: splToken.TOKEN_PROGRAM_ID,
                                            })
                                                .signers([])
                                                .instruction()];
                                    case 4:
                                        instruction = _c.sent();
                                        return [2 /*return*/, instruction];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(instructions)];
                    case 3:
                        instructionTx = _b.sent();
                        return [2 /*return*/, instructionTx];
                }
            });
        });
    };
    /**
     * 将 children NFT 注入到 mint NFT
     * @param owner 所属
     * @param mintKey 被注入的 NFT 的 mint
     * @param childrenMint 注入的 NFT，数组。协议支持一下注入多个
     * @param { parentMintKey, rootPDA } 注入非 root NFT需要提供被注入的 root 信息
     * @returns
     */
    SynftContract.prototype.injectNFTToNonRoot = function (owner, mintKey, // mint4
    childrenMint, // mint5
    rootPDA, reversible) {
        if (reversible === void 0) { reversible = true; }
        return __awaiter(this, void 0, void 0, function () {
            var program, connection, rootMeta, rootMintKey, rootMintTokenAccounts, rootMintTokenAccountAddr, rootMetadataPDA, _a, metadataPDA, metadataBump, mintTokenAccounts, mintTokenAccountAddr, instructions, instructionTx;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        if (childrenMint.length === 0) {
                            throw new Error("childrenMint must has one item");
                        }
                        program = this.program;
                        connection = this._connection;
                        return [4 /*yield*/, program.account.childrenMetadata.fetch(rootPDA)];
                    case 1:
                        rootMeta = _b.sent();
                        rootMintKey = rootMeta.parent;
                        return [4 /*yield*/, connection.getTokenLargestAccounts(rootMintKey)];
                    case 2:
                        rootMintTokenAccounts = _b.sent();
                        rootMintTokenAccountAddr = rootMintTokenAccounts.value[0].address;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                Buffer.from(exports.SynftSeed.CHILDREN_OF),
                                rootMintKey.toBuffer(),
                                mintKey.toBuffer(),
                            ], PROGRAM_ID)];
                    case 3:
                        rootMetadataPDA = (_b.sent())[0];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.PARENT_METADATA), mintKey.toBuffer()], PROGRAM_ID)];
                    case 4:
                        _a = _b.sent(), metadataPDA = _a[0], metadataBump = _a[1];
                        return [4 /*yield*/, connection.getTokenLargestAccounts(mintKey)];
                    case 5:
                        mintTokenAccounts = _b.sent();
                        mintTokenAccountAddr = mintTokenAccounts.value[0].address;
                        instructions = childrenMint.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, childMetadataPDA, childMetadataBump, _b, itemParentMetadataPDA, childMintTokenAccounts, childMintTokenAccountAddr, instruction;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                            Buffer.from(exports.SynftSeed.CHILDREN_OF),
                                            mintKey.toBuffer(),
                                            item.toBuffer(),
                                        ], PROGRAM_ID)];
                                    case 1:
                                        _a = _c.sent(), childMetadataPDA = _a[0], childMetadataBump = _a[1];
                                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                                Buffer.from(anchor.utils.bytes.utf8.encode(exports.SynftSeed.PARENT_METADATA)),
                                                item.toBuffer(),
                                            ], program.programId)];
                                    case 2:
                                        _b = _c.sent(), itemParentMetadataPDA = _b[0], _b[1];
                                        return [4 /*yield*/, connection.getTokenLargestAccounts(item)];
                                    case 3:
                                        childMintTokenAccounts = _c.sent();
                                        childMintTokenAccountAddr = childMintTokenAccounts.value[0].address;
                                        return [4 /*yield*/, program.methods
                                                .injectToNonRoot(reversible, childMetadataBump, metadataBump)
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
                                                systemProgram: web3_js.SystemProgram.programId,
                                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                                                tokenProgram: splToken.TOKEN_PROGRAM_ID,
                                            })
                                                .instruction()];
                                    case 4:
                                        instruction = _c.sent();
                                        return [2 /*return*/, instruction];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(instructions)];
                    case 6:
                        instructionTx = _b.sent();
                        return [2 /*return*/, instructionTx];
                }
            });
        });
    };
    /**
     * 将注入的 SOL 提取出来
     * @param mintKey 被注入的 NFT 的 mint
     * @param walletPubKey 钱包的 PubKey
     * @returns Promise<TransactionInstruction>
     */
    SynftContract.prototype.extractSOL = function (mintKey, walletPubKey) {
        return __awaiter(this, void 0, void 0, function () {
            var program, connection, _a, solPDA, solBump, parentMintTokenAccountBalancePairs, parentMintTokenAccountAddr, extractTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        program = this.program;
                        connection = this._connection;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.SOL), mintKey.toBuffer()], program.programId)];
                    case 1:
                        _a = _b.sent(), solPDA = _a[0], solBump = _a[1];
                        return [4 /*yield*/, connection.getTokenLargestAccounts(mintKey)];
                    case 2:
                        parentMintTokenAccountBalancePairs = _b.sent();
                        parentMintTokenAccountAddr = parentMintTokenAccountBalancePairs.value[0].address;
                        return [4 /*yield*/, program.methods
                                .extractSol(solBump)
                                .accounts({
                                currentOwner: walletPubKey,
                                parentTokenAccount: parentMintTokenAccountAddr,
                                parentMintAccount: mintKey,
                                solAccount: solPDA,
                                systemProgram: web3_js.SystemProgram.programId,
                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            })
                                .signers([])
                                .instruction()];
                    case 3:
                        extractTx = _b.sent();
                        return [2 /*return*/, extractTx];
                }
            });
        });
    };
    SynftContract.prototype.extractChildNFTToUser = function (walletPubKey, receiver, mintKey, // mint4
    _a) {
        var parentMintKey = _a.parentMintKey, // mint3
        rootMintKey = _a.rootMintKey;
        return __awaiter(this, void 0, void 0, function () {
            var program, connection, isRootChild, rootMintTokenAccounts, rootMintTokenAccountAddr, _b, rootMetaPDA, _c, parentMetaPDA, parentMetadataBump, mintTokenAccounts, mintTokenAccountAddr, tx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        program = this.program;
                        connection = this._connection;
                        isRootChild = rootMintKey.toString() === parentMintKey.toString();
                        return [4 /*yield*/, connection.getTokenLargestAccounts(rootMintKey)];
                    case 1:
                        rootMintTokenAccounts = _d.sent();
                        rootMintTokenAccountAddr = rootMintTokenAccounts.value[0].address;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                Buffer.from(exports.SynftSeed.CHILDREN_OF),
                                rootMintKey.toBuffer(),
                                parentMintKey.toBuffer(),
                            ], PROGRAM_ID)];
                    case 2:
                        _b = _d.sent(), rootMetaPDA = _b[0], _b[1];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([
                                Buffer.from(exports.SynftSeed.CHILDREN_OF),
                                parentMintKey.toBuffer(),
                                mintKey.toBuffer(),
                            ], PROGRAM_ID)];
                    case 3:
                        _c = _d.sent(), parentMetaPDA = _c[0], parentMetadataBump = _c[1];
                        return [4 /*yield*/, connection.getTokenLargestAccounts(mintKey)];
                    case 4:
                        mintTokenAccounts = _d.sent();
                        mintTokenAccountAddr = mintTokenAccounts.value[0].address;
                        return [4 /*yield*/, program.methods
                                .transferChildNft(parentMetadataBump)
                                .accounts({
                                currentOwner: walletPubKey,
                                childTokenAccount: mintTokenAccountAddr,
                                childMintAccount: mintKey,
                                rootTokenAccount: rootMintTokenAccountAddr,
                                rootMintAccount: rootMintKey,
                                childrenMetaOfParent: parentMetaPDA,
                                parentMintAccount: parentMintKey,
                                rootMeta: isRootChild ? parentMetaPDA : rootMetaPDA,
                                receiverAccount: receiver,
                                systemProgram: web3_js.SystemProgram.programId,
                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                                tokenProgram: splToken.TOKEN_PROGRAM_ID,
                            })
                                .signers([])
                                .instruction()];
                    case 5:
                        tx = _d.sent();
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    SynftContract.prototype.burn = function (walletPubKey, mintKey) {
        return __awaiter(this, void 0, void 0, function () {
            var program, _a, solPDA, _b, parentPDA, oldRootOwner, mintTokenAccount, mintTokenAccountAddress, burnTx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        program = this.program;
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.SOL), mintKey.toBuffer()], program.programId)];
                    case 1:
                        _a = _c.sent(), solPDA = _a[0], _a[1];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.PARENT_METADATA), mintKey.toBuffer()], program.programId)];
                    case 2:
                        _b = _c.sent(), parentPDA = _b[0], _b[1];
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from("root-owner-seed"), mintKey.toBuffer()], program.programId)];
                    case 3:
                        oldRootOwner = (_c.sent())[0];
                        return [4 /*yield*/, this._connection.getTokenLargestAccounts(mintKey)];
                    case 4:
                        mintTokenAccount = _c.sent();
                        mintTokenAccountAddress = mintTokenAccount.value[0].address;
                        return [4 /*yield*/, program.methods
                                .startBurn()
                                .accounts({
                                currentOwner: walletPubKey,
                                parentMintAccount: mintKey,
                                parentTokenAccount: mintTokenAccountAddress,
                                parentMetadata: parentPDA,
                                solAccount: solPDA,
                                oldRootOwner: oldRootOwner,
                                systemProgram: web3_js.SystemProgram.programId,
                                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                                tokenProgram: splToken.TOKEN_PROGRAM_ID,
                            })
                                .signers([])
                                .instruction()];
                    case 5:
                        burnTx = _c.sent();
                        return [2 /*return*/, burnTx];
                }
            });
        });
    };
    SynftContract.prototype.getRootMintFromRootPDA = function (pda) {
        return __awaiter(this, void 0, void 0, function () {
            var rootMeta, rootMintKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        return [4 /*yield*/, this.program.account.childrenMetadata.fetch(pda)];
                    case 1:
                        rootMeta = _a.sent();
                        rootMintKey = rootMeta.parent;
                        return [2 /*return*/, rootMintKey];
                }
            });
        });
    };
    SynftContract.prototype.getParentNFT = function (mintKey) {
        return __awaiter(this, void 0, void 0, function () {
            var parentNFT, rootPDA, rootMintKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        return [4 /*yield*/, this.program.account.childrenMetadata.all([
                                {
                                    memcmp: {
                                        offset: CHILD_OFFSET,
                                        bytes: mintKey.toBase58(),
                                    },
                                },
                            ])];
                    case 1:
                        parentNFT = _a.sent();
                        if (!(parentNFT && parentNFT[0])) return [3 /*break*/, 3];
                        rootPDA = parentNFT[0].account.root.toString();
                        return [4 /*yield*/, this.getRootMintFromRootPDA(rootPDA)];
                    case 2:
                        rootMintKey = _a.sent();
                        return [2 /*return*/, {
                                mint: parentNFT[0].account.parent.toString(),
                                rootPDA: parentNFT[0].account.root.toString(),
                                isMutated: parentNFT[0].account.isMutated,
                                rootMint: rootMintKey.toString(),
                            }];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    SynftContract.prototype.getInjectChildren = function (mintKey) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, childrenNFT;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        filter = [
                            {
                                memcmp: {
                                    offset: PARENT_OFFSET,
                                    bytes: mintKey.toBase58(),
                                },
                            },
                        ];
                        return [4 /*yield*/, this.program.account.childrenMetadata.all(filter)];
                    case 1:
                        childrenNFT = _a.sent();
                        return [2 /*return*/, childrenNFT];
                }
            });
        });
    };
    SynftContract.prototype.getInjectSOL = function (mintKey) {
        return __awaiter(this, void 0, void 0, function () {
            var solPDA, solChildrenMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        return [4 /*yield*/, web3_js.PublicKey.findProgramAddress([Buffer.from(exports.SynftSeed.SOL), mintKey.toBuffer()], PROGRAM_ID)];
                    case 1:
                        solPDA = (_a.sent())[0];
                        return [4 /*yield*/, this._connection.getAccountInfo(solPDA)];
                    case 2:
                        solChildrenMetadata = _a.sent();
                        return [2 /*return*/, solChildrenMetadata];
                }
            });
        });
    };
    SynftContract.prototype.checkHasInject = function (mintKey) {
        return __awaiter(this, void 0, void 0, function () {
            var solChildrenMetadata, childrenNFT;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connection || !this.program) {
                            throw new Error("Init Contract with connect first");
                        }
                        return [4 /*yield*/, this.getInjectSOL(mintKey)];
                    case 1:
                        solChildrenMetadata = _a.sent();
                        return [4 /*yield*/, this.getInjectChildren(mintKey)];
                    case 2:
                        childrenNFT = _a.sent();
                        return [2 /*return*/, {
                                hasInjected: !!solChildrenMetadata || childrenNFT.length > 0,
                                hasInjectedNFT: childrenNFT.length > 0,
                                hasInjectedSOL: !!solChildrenMetadata,
                            }];
                }
            });
        });
    };
    return SynftContract;
}());

exports.PROGRAM_ID = PROGRAM_ID;
exports["default"] = SynftContract;
//# sourceMappingURL=index.js.map
