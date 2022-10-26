/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-17 19:13:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:09:51
 * @Description: file description
 */
import { Twitter, Discord, Metamask, Phantom, Martian } from '@ecnft/wl-user-core'
const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID || ''
const TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_CALLBACK_URL || ''
const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID || ''
const DISCORD_CALLBACK_URL = process.env.REACT_APP_DISCORD_CALLBACK_URL || ''
export const signers = [
  new Twitter({ twitterClientId: TWITTER_CLIENT_ID, oauthCallbackUri: TWITTER_CALLBACK_URL }),
  new Discord({ discordClientId: DISCORD_CLIENT_ID, oauthCallbackUri: DISCORD_CALLBACK_URL }),
  new Metamask(),
  new Phantom(),
  new Martian(),
]
