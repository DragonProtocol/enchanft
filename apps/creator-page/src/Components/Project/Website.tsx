import { Box } from './ItemBox';

export default function Website({
  websiteUrl,
  setWebsiteUrl,
}: {
  websiteUrl: string;
  setWebsiteUrl: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Website URL</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="Input"
          value={websiteUrl}
          onChange={(e) => {
            setWebsiteUrl(e.target.value);
          }}
        />
      </div>
    </Box>
  );
}
