import React, { createContext, useMemo, useContext } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import SynftContract from '@ecnft/js-sdk-core';
export { PROGRAM_ID as SYNFT_PROGRAM_ID, SynftSeed } from '@ecnft/js-sdk-core';

var SynftContractContext = createContext(null);
var Provider = function (_a) {
    var children = _a.children;
    var connectionCtx = useConnection();
    var conn = connectionCtx.connection;
    var synftContract = useMemo(function () {
        var instance = new SynftContract(conn);
        console.log("synft instance", instance, conn);
        return instance;
    }, [conn]);
    return (React.createElement(SynftContractContext.Provider, { value: { synftContract: synftContract } }, children));
};
function useSynftContract() {
    var ctx = useContext(SynftContractContext);
    if (!ctx) {
        throw new Error("SynftContract not valid");
    }
    return ctx;
}

export { Provider, SynftContractContext, useSynftContract };
//# sourceMappingURL=index.js.map
