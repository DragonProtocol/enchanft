import { numberInput } from '../../../utils';
import { BlockchainType } from '../types';
import { Box } from './Box';
export default function MintPrice({
  blockchain,
  mintPrice,
  updateMintPrice,
}: {
  blockchain: BlockchainType;
  mintPrice: string;
  updateMintPrice?: (arg0: string) => void;
}) {
  const coin = blockchain === BlockchainType.Solana ? 'SOL' : 'ETH';
  return (
    <Box>
      <h4>Mint Price(in {coin})</h4>
      <div className="input-area">
        <input
          title="mint-price"
          type="text"
          value={mintPrice.replaceAll(' SOL', '').replaceAll(' ETH', '')}
          onKeyPress={numberInput}
          onChange={(e) => {
            const value = e.target.value + ' ' + coin;
            updateMintPrice && updateMintPrice(value);
          }}
        />
      </div>
    </Box>
  );
}
