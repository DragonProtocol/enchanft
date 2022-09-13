import { Box } from './ItemBox';

export default function Name({
  name,
  setName,
}: {
  name: string;
  setName: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Project Name</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="At least 4 characters"
          value={name}
          onChange={(e) => {
            if (e.target.value.length > 40) return;
            setName(e.target.value);
          }}
        />
        <span>{name.length}/40</span>
      </div>
    </Box>
  );
}
