export const connectionSocialMedia = (type: string) => {
  const socialMediaMap = {
    twitter:
      `https://twitter.com/i/oauth2/authorize?
response_type=code&
client_id=Z2dvdGFFV0pOa3BkTWdQWF9GdGg6MTpjaQ&
redirect_uri=https://wl.xyz/auth&
scope=bookmark.read+block.read+like.read+list.read+follows.read+space.read+mute.read+tweet.read+users.read+offline.access&
state=3063390848298.8647&
code_challenge=challenge&
code_challenge_method=plain`,
    discord:
      `https://discord.com/oauth2/authorize?
response_type=code&
client_id=1003616859582627881&
scope=identify%20guilds&
state=15773059ghq9183habn&
redirect_uri=https://wl.xyz/auth?type=DISCORD&
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
