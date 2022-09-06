import Arweave from 'arweave';

/** Initialize Arweave */
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  timeout: 60000,
  protocol: 'https'
});

/** Arweave private key */
export const arweave_key = {
    "kty": "RSA",
    "n": process.env.arweave_key_u,
    "e":"AQAB",
    "d": process.env.arweave_key_d,
    "p": process.env.arweave_key_p,
    "q": process.env.arweave_key_q,
    "dp": process.env.arweave_key_dp,
    "dq": process.env.arweave_key_dq,
    "qi": process.env.arweave_key_qi
}

/** Upload an image to Arweave */
export async function arweavePush(_data, _type) {
    // Generate Arweave transaction
    let transaction = await arweave.createTransaction({
        data: _data
    }, arweave_key);
    transaction.addTag('Content-Type', _type);

    // Sign transaction
    let _tx = await arweave.transactions.sign(transaction, arweave_key);

    // Initiate Arweave uploader

    let uploader;
    try {
      uploader = await arweave.transactions.getUploader(transaction);
    } catch(e) {
      throw new Error("Error: " + e);
    }


    while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
    return transaction.id;
}
