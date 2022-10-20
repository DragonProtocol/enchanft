import { Box } from './ItemBox';
import { MintStage } from './types';

export default function ProjectState({
  state,
  setState,
}: {
  state: MintStage;
  setState: (type: MintStage) => void;
}) {
  return (
    <Box>
      <h4>Project State</h4>
      <select
        title="status"
        value={state}
        onChange={(e) => {
          setState(e.target.value as MintStage);
        }}
      >
        <option value={MintStage.FUTURE}>{MintStage.FUTURE}</option>
        <option value={MintStage.LIVE}>{MintStage.LIVE}</option>
        <option value={MintStage.SOLDOUT}>{MintStage.SOLDOUT}</option>
      </select>
    </Box>
  );
}
