export const connectionSocialMedia = (type: string) => {
  const socialMediaMap = {
    twitter:
      'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=bzBLMWs0NnBHejQ4a3dXYkROTHk6MTpjaQ&redirect_uri=https://launch.enchanft.xyz/auth&scope=tweet.read+users.read+offline.access&state=3063390848298.8647&code_challenge=challenge&code_challenge_method=plain',
    discord:
      'https://discord.com/oauth2/authorize?response_type=code&client_id=991279625395241014&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=https://launch.enchanft.xyz/auth?type=DISCORD&prompt=consent',
  }

  const standardType = type in socialMediaMap ? type : 'twitter'

  const url = socialMediaMap[standardType]

  window.open(
    url,
    '__blank',
    'width=640,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no',
  )
}
