import IconTwitterWhite from '../Icons/IconTwitterWhite';
import { Box } from './ItemBox';

export default function TwitterLink({
  linkAction,
}: {
  linkAction: () => void;
}) {
  return (
    <Box>
      <h4>Twitter Link</h4>
      <button className="twitter" onClick={linkAction}>
        <IconTwitterWhite size="28px" /> Link Twitter
      </button>
    </Box>
  );
}
