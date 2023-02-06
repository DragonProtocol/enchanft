/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-20 18:27:13
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 13:43:53
 * @Description: file description
 */
const loadImg = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    const delImg = () => {
      img.onload = null;
      img.onerror = null;
      img = null;
    };
    if (img.complete) {
      // 如果图片已经存在于浏览器缓存
      resolve(url);
      delImg();
      return;
    }
    // 加载成功
    img.onload = () => {
      resolve(url);
      delImg();
    };
    // 加载失败
    img.onerror = () => {
      reject(new Error('load image faild'));
      delImg();
    };
  });
};
export const fetchPlatformImgUrlByLink = async (
  link: string
): Promise<string> => {
  const linkSplitAry = link.split('/');
  const platformImgUrl = `${linkSplitAry[0]}//${linkSplitAry[2]}/favicon`;

  try {
    const img = `${platformImgUrl}.ico`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }
  try {
    const img = `${platformImgUrl}.png`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }
  try {
    const img = `${platformImgUrl}.gif`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }

  return '';
};
