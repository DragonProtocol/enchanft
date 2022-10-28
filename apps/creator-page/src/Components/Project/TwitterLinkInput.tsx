import { Box } from './ItemBox';

export default function TwitterLinkInput({
  twitterName,
  setTwitterName,
}: {
  twitterName: string;
  setTwitterName: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Twitter Screen Name</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="Input"
          value={twitterName}
          onChange={(e) => {
            const value = e.target.value;
            setTwitterName(value);
          }}
        />
      </div>
    </Box>
  );
}
