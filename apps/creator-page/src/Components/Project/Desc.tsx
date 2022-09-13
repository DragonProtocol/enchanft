import { Box } from './ItemBox';

export default function Desc({
  desc,
  setDesc,
}: {
  desc: string;
  setDesc: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Project Description</h4>
      <div className="input-area">
        <textarea
          title="desc"
          name=""
          id=""
          placeholder="Input"
          value={desc}
          onChange={(e) => {
            if (e.target.value.length > 250) return;
            setDesc(e.target.value);
          }}
        />
        <span>{desc.length}/250</span>
      </div>
    </Box>
  );
}
