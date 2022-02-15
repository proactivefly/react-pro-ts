import RenderAuthorize from "@/components/Authorized";


// getAuthority()返回的是权限数组 ['admin']
import { getAuthority } from "./authority";
// 
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */


let Authorized = RenderAuthorize(getAuthority());
console.log('Authorized----',Authorized)

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/**
 * hard code
 * block need it。
 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
