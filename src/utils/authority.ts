import { reloadAuthorized } from "./Authorized";
// 使用localStorage存储权限信息，这些信息可能是在实际项目中从服务器发送的。
 //
export function getAuthority(str?: string): string | string[] {
  // 如果未传入参数，从localStorage中获取，如果传了就用str  
  const authorityString = 
    typeof str === "undefined" ? localStorage.getItem("antd-pro-authority"): str;
  // authorityString 形如  admin, "admin", ["admin"]
  let authority;

  //如果JSON.parse报错了就直接取值
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (
    !authority &&
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site"
  ) {
    return ["admin"];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === "string" ? [authority] : authority;
  localStorage.setItem("antd-pro-authority", JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
