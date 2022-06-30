# synft-js-sdk

## usage

```tsx
...
import SynftContract from "@jsrsc/synft-js";
...

function Demo() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [synftContract, setSynftContract] = useState<SynftContract>();

  useEffect(() => {
    const instance = new SynftContract(connection);
    setSynftContract(instance);
  }, [connection]);

  const copyNFT = useCallback(async () => {
    const owner = wallet.publicKey;
    if (!owner || !synftContract) return;
    const mint = new PublicKey("4ujSR37Xwqck7goo5Uv8rBokAJXiD7beYktjH59PzN5H");
    const copyNFTInstruction = await synftContract.copyNFTInstruction(
      owner,
      mint,
      {
        name: "45",
        symbol: "synft",
        metadataUri: "https://www.arweave.net/10MIAEz-HeHmOjrcy8j8ATrUX78rsTzpiddLn9GLSNo?ext=png",
      }
    );

    const tx = new Transaction().add(copyNFTInstruction);
    const signature = await wallet.sendTransaction(tx, connection);
    const latestBlockHash = await connection.getLatestBlockhash();
    // const result = await connection.confirmTransaction(signature, "processed");
    const result = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    console.log(result);
  }, [synftContract, wallet, connection]);

  return (
    <div>
      Demo <button onClick={copyNFT}>copyNFT</button>
    </div>
  );
}

export default App;

```