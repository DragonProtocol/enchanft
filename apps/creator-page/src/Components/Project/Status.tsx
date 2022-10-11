import { Box } from './ItemBox';
import { State } from './types';

export default function Blockchain({
  state,
  setState,
}: {
  state: State;
  setState: (type: State) => void;
}) {
  return (
    <Box>
      <h4>Project State</h4>
      <select
        title="status"
        value={state}
        onChange={(e) => {
          setState(e.target.value as State);
        }}
      >
        <option value={State.FUTURE}>{State.FUTURE}</option>
        <option value={State.ACTIVE}>{State.ACTIVE}</option>
      </select>
    </Box>
  );
}
