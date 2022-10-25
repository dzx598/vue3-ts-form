enum CacheKey {
  userInfo = "pathology_userInfo",
}

export const setUserInfo = (userInfo: any) => {
  window.sessionStorage.setItem(CacheKey.userInfo, JSON.stringify(userInfo));
};
export const getUserInfo = () => {
  const userInfo = window.sessionStorage.getItem(CacheKey.userInfo);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return {};
  }
};
