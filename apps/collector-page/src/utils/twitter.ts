/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-11 16:53:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 11:47:44
 * @Description: file description
 */
export const TWITTER_URI = 'https://twitter.com'
export const TWITTER_URI_INTENT = `${TWITTER_URI}/intent`
export const TWITTER_URI_FOLLOW = `${TWITTER_URI_INTENT}/follow`
export const TWITTER_URI_LIKE = `${TWITTER_URI_INTENT}/like`
export const TWITTER_URI_RETWEET = `${TWITTER_URI_INTENT}/retweet`
export const TWITTER_URI_TWEET = `${TWITTER_URI_INTENT}/tweet`

export const getTwitterHomeLink = (twitterId: string) => `${TWITTER_URI}/${twitterId}`
export const getTwitterFollowLink = (screenName: string) => {
  return `${TWITTER_URI_FOLLOW}?screen_name=${screenName}`
}
export const getTwitterLikeLink = (tweetId: string) => {
  return `${TWITTER_URI_LIKE}?tweet_id=${tweetId}`
}
export const getTwitterRetweetLink = (tweetId: string) => {
  return `${TWITTER_URI_RETWEET}?tweet_id=${tweetId}`
}

export const tweetShare = (content, url) => {
  window.open(`${TWITTER_URI_TWEET}?text=${content}&url=${url}`)
}