import { DiscordBotCallback } from '../../utils/socialMedia';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import { Box } from './ItemBox';
import RightIcon from '../Icons/IconRight';
import styled from 'styled-components';

export default function InviteBot({ hasInviteBot }: { hasInviteBot: boolean }) {
  return (
    <ContentBox>
      <h4>Invite WL Bot</h4>
      <InviteBotBtn hasInviteBot={hasInviteBot} />
    </ContentBox>
  );
}

export function InviteBotBtn({ hasInviteBot }: { hasInviteBot: boolean }) {
  return (
    <div className="wl-bot">
      <button
        className="invite-bot"
        onClick={() => {
          window.open(
            DiscordBotCallback,
            '__blank',
            `width=480,
                  height=800,
                  top=0,
                  menubar=no,
                  toolbar=no,
                  status=no,
                  scrollbars=no,
                  resizable=yes,
                  directories=no,
                  status=no,
                  location=no`
          );
        }}
      >
        <IconDiscordWhite size="28px" /> Invite WL Bot
      </button>
      {hasInviteBot && <RightIcon />}
    </div>
  );
}

const ContentBox = styled(Box)`
  & .wl-bot {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
