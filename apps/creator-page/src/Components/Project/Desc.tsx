import { Box } from './ItemBox';

export default function Desc({
  desc,
  setDesc,
  title = 'Project Description',
}: {
  desc: string;
  setDesc: (arg0: string) => void;
  title?: string;
}) {
  return (
    <Box>
      <h4>{title}</h4>
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
