import React from 'react';
import SynftContract from '@enchanft/js-sdk-core';
export { PROGRAM_ID as SYNFT_PROGRAM_ID, SynftSeed } from '@enchanft/js-sdk-core';

interface SynftContextData {
    synftContract: SynftContract;
}
declare const SynftContractContext: React.Context<SynftContextData | null>;
declare type Props = {
    children: React.ReactNode;
};
declare const Provider: ({ children }: Props) => JSX.Element;
declare function useSynftContract(): SynftContextData;

export { Provider, SynftContextData, SynftContractContext, useSynftContract };
