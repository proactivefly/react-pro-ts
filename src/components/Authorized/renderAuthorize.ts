/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */

// 当前权限
let CURRENT: string | string[] = "NULL";

// 当前权限类型 字符串 或字符串数组 或函数
type CurrentAuthorityType = string | string[] | (() => typeof CURRENT);



/* 

  const fun=<T>(Authorized: T):((currentAuthority: CurrentAuthorityType) => T)=>{
    return (currentAuthority: CurrentAuthorityType) => Authorized
  }

  函数接收参数T ，返回值为函数（该函数参数是CurrentAuthorityType类型，返回T类型）

} */



const renderAuthorize =

  <T>(Authorized: T): ((currentAuthority: CurrentAuthorityType) => T) =>{
    let what=(currentAuthority: CurrentAuthorityType): T => {
      if (currentAuthority) {
        console.log('currentAuthority——————————————————————————————',currentAuthority)
        if (typeof currentAuthority === "function") {
          CURRENT = currentAuthority();
        }
        if (
          Object.prototype.toString.call(currentAuthority) ==="[object String]" 
          ||
          Array.isArray(currentAuthority)
        ) {
          CURRENT = currentAuthority as string[];
        }
      } else {
        CURRENT = "NULL";
      }
      return Authorized;
    };
    return what
  }
  

export { CURRENT };
export default <T>(Authorized: T) => renderAuthorize<T>(Authorized);
