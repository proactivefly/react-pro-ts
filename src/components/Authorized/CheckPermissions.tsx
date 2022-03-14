import React from "react";
import { CURRENT } from "./renderAuthorize";
// eslint-disable-next-line import/no-cycle
import PromiseRender from "./PromiseRender";

export type IAuthorityType =
  | undefined
  | string
  | string[]
  | Promise<boolean>
  | ((currentAuthority: string | string[]) => IAuthorityType);

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority   路由菜单里的权限
 * @param { 你的权限 | Your permission description } currentAuthority   登录后的权限
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = <T, K>(
  authority: IAuthorityType,
  currentAuthority: string | string[],
  target: T,
  Exception: K
): T | K | React.ReactNode => {
  // 没有判定权限.默认查看所有
  if (!authority) { return target; }
  // 数组处理
  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      /**
       * 
       *  some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
          some() 方法会依次执行数组的每个元素：
          如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
          如果没有满足条件的元素，则返回false。
          注意： some() 不会对空数组进行检测。
          注意： some() 不会改变原始数组。
       */
      if (currentAuthority.some((item) => authority.includes(item))) {
        return target;
      }
    } else if (authority.includes(currentAuthority)) {
      return target;
    }
    return Exception;
  }
  // string 处理
  if (typeof authority === "string") {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }
    return Exception;
  }
  // Promise 处理
  if (authority instanceof Promise) {
    return (
      <PromiseRender<T, K> ok={target} error={Exception} promise={authority} />
    );
  }
  // Function 处理
  if (typeof authority === "function") {
    const bool = authority(currentAuthority);
    // 函数执行后返回值是 Promise
    if (bool instanceof Promise) {
      return (
        <PromiseRender<T, K> ok={target} error={Exception} promise={bool} />
      );
    }
    if (bool) {
      return target;
    }
    return Exception;
  }
  throw new Error("unsupported parameters");
};

export { checkPermissions };

function check<T, K>(
  authority: IAuthorityType,
  target: T,
  Exception: K
): T | K | React.ReactNode {
  return checkPermissions<T, K>(authority, CURRENT, target, Exception);
}

export default check;
