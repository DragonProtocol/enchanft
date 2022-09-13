import { DiscordBotCallback } from '../../utils/socialMedia';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import { Box } from './ItemBox';

export default function InviteBot() {
  return (
    <Box>
      <h4>Invite WL Bot</h4>
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
    </Box>
  );
}
