/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-08 13:44:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-22 10:51:15
 * @Description: file description
 */
const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID
export const TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_CALLBACK_URL
const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID
const DISCORD_CALLBACK_URL = process.env.REACT_APP_DISCORD_CALLBACK_URL
export enum SocialMediaType {
  TWITTER_OAUTH2_AUTHORIZE = 'twitter_auth2_authorize',
  TWITTER_OAUTH_AUTHENTICATE = 'twitter_oauth_authenticate',
  DISCORD_OAUTH2_AUTHORIZE = 'discord_oauth2_authorize',
}
type SocialMediaParams = {
  oauthToken?: string
}
export const connectionSocialMedia = (type: SocialMediaType, params?: SocialMediaParams) => {
  const socialMediaMap = {
    [SocialMediaType.TWITTER_OAUTH2_AUTHORIZE]: `https://twitter.com/i/oauth2/authorize?
response_type=code&
client_id=${TWITTER_CLIENT_ID}&
redirect_uri=${TWITTER_CALLBACK_URL}&
scope=bookmark.read+block.read+like.read+list.read+follows.read+space.read+mute.read+tweet.read+users.read+offline.access&
state=3063390848298.8647&
code_challenge=challenge&
code_challenge_method=plain`,
    [SocialMediaType.DISCORD_OAUTH2_AUTHORIZE]: `https://discord.com/oauth2/authorize?
response_type=code&
client_id=${DISCORD_CLIENT_ID}&
scope=identify%20guilds&
state=15773059ghq9183habn&
redirect_uri=${DISCORD_CALLBACK_URL}&
prompt=consent`,
    [SocialMediaType.TWITTER_OAUTH_AUTHENTICATE]: `https://api.twitter.com/oauth/authenticate?oauth_token=${params?.oauthToken}`,
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
