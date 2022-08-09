const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL;
export const connectionSocialMedia = (type: string) => {
  const socialMediaMap = {
    twitter: `https://twitter.com/i/oauth2/authorize?
response_type=code&
client_id=${TWITTER_CLIENT_ID}&
redirect_uri=${TWITTER_CALLBACK_URL}&
scope=bookmark.read+block.read+like.read+list.read+follows.read+space.read+mute.read+tweet.read+users.read+offline.access&
state=3063390848298.8647&
code_challenge=challenge&
code_challenge_method=plain`,
    discord: `https://discord.com/oauth2/authorize?
response_type=code&
client_id=${DISCORD_CLIENT_ID}&
scope=identify%20guilds&
state=15773059ghq9183habn&
redirect_uri=${DISCORD_CALLBACK_URL}&
prompt=consent`,
  }

  const standardType = type in socialMediaMap ? type : 'twitter'

  const url = socialMediaMap[standardType]

  window.open(
    url,
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
location=no`,
  )
}
