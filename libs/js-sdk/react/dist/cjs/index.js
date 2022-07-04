'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var walletAdapterReact = require('@solana/wallet-adapter-react');
var SynftContract = require('@ecnft/js-sdk-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var SynftContract__default = /*#__PURE__*/_interopDefaultLegacy(SynftContract);

var SynftContractContext = React.createContext(null);
var Provider = function (_a) {
    var children = _a.children;
    var connectionCtx = walletAdapterReact.useConnection();
    var conn = connectionCtx.connection;
    var synftContract = React.useMemo(function () {
        var instance = new SynftContract__default["default"](conn);
        console.log("synft instance", instance, conn);
        return instance;
    }, [conn]);
    return (React__default["default"].createElement(SynftContractContext.Provider, { value: { synftContract: synftContract } }, children));
};
function useSynftContract() {
    var ctx = React.useContext(SynftContractContext);
    if (!ctx) {
        throw new Error("SynftContract not valid");
    }
    return ctx;
}

Object.defineProperty(exports, 'SYNFT_PROGRAM_ID', {
    enumerable: true,
    get: function () { return SynftContract.PROGRAM_ID; }
});
Object.defineProperty(exports, 'SynftSeed', {
    enumerable: true,
    get: function () { return SynftContract.SynftSeed; }
});
exports.Provider = Provider;
exports.SynftContractContext = SynftContractContext;
exports.useSynftContract = useSynftContract;
//# sourceMappingURL=index.js.map
