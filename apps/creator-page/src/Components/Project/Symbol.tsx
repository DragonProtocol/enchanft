import { Box } from './ItemBox';

export default function Symbol({
  customUrl,
  setCustomUrl,
}: {
  customUrl: string;
  setCustomUrl: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Project Symbol (Custom URL)</h4>
      <div className="input-area">
        <label>https://wl.xyz//</label>
        <input title="name" type="text" value={customUrl} onChange={() => {}} />
      </div>
    </Box>
  );
}
