import IconTwitterWhite from '../Icons/IconTwitterWhite';
import { Box } from './ItemBox';
import IconRightTwitter from '../Icons/IconRightTwitter';
import styled from 'styled-components';

export default function TwitterLink({
  hasTwitter,
  twitterName,
  linkAction,
  msg,
}: {
  hasTwitter: boolean;
  twitterName: string;
  linkAction: () => void;
  msg?: string;
}) {
  return (
    <ContentBox>
      <h4>Twitter Link</h4>
      <div className="wl-bot">
        <button className="twitter" onClick={linkAction}>
          <IconTwitterWhite size="28px" />{' '}
          {hasTwitter ? `@${twitterName}` : msg || 'Link Twitter'}
        </button>
        {hasTwitter && <IconRightTwitter />}
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(Box)`
  & .wl-bot {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
