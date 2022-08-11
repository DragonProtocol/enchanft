/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-11 16:53:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-11 17:15:30
 * @Description: file description
 */
export const TWITTER_URI_INTENT = 'https://twitter.com/intent'
export const TWITTER_URI_FOLLOW = `${TWITTER_URI_INTENT}/follow`
export const TWITTER_URI_LIKE = `${TWITTER_URI_INTENT}/like`
export const TWITTER_URI_RETWEET = `${TWITTER_URI_INTENT}/retweet`
export const getTwitterFollowLink = (name: string) => {
  return `${TWITTER_URI_FOLLOW}?screen_name=${name}`
}
export const getTwitterLikeLink = (tweetId: string) => {
  return `${TWITTER_URI_LIKE}?tweet_id=${tweetId}`
}
export const getTwitterRetweetLink = (tweetId: string) => {
  return `${TWITTER_URI_RETWEET}?tweet_id=${tweetId}`
}
