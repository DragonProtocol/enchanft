import { Box } from './ItemBox';

export default function InviteBotInput({
  botUrl,
  setBotUrl,
}: {
  botUrl: string;
  setBotUrl: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Discord Invite Link</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="Input"
          value={botUrl}
          onChange={(e) => {
            const value = e.target.value;
            setBotUrl(value);
          }}
        />
      </div>
    </Box>
  );
}
