import React from "react";
import SynftContract from "@enchanft/js-sdk-core";
export { SynftSeed, PROGRAM_ID as SYNFT_PROGRAM_ID, } from "@enchanft/js-sdk-core";
export interface SynftContextData {
    synftContract: SynftContract;
}
export declare const SynftContractContext: React.Context<SynftContextData | null>;
declare type Props = {
    children: React.ReactNode;
};
export declare const Provider: ({ children }: Props) => JSX.Element;
export declare function useSynftContract(): SynftContextData;
