import { stringify } from "querystring";
import { history, Reducer, Effect } from "umi";

import { fakeAccountLogin } from "@/services/login";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { message } from "antd";

export interface StateType {
  status?: "ok" | "error";
  type?: string;
  currentAuthority?: "user" | "guest" | "admin";
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: "login",
  state: {
    status: undefined,
  },



  /**
   * 
   * 格式为 *(action, effects) => void 或 [*(action, effects) => void, { type }]。
   * 
   * type 类型有：takeEvery，takeLatest，throttle，watcher
   * 参考链接 ：https://dvajs.com/api/#effects
   */
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response,
      });
      // Login successfully
      if (response.status === "ok") {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success("🎉 🎉 🎉  登录成功！");
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            window.location.href = "/";
            return;
          }
        }
        history.replace(redirect || "/");
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== "/user/login" && !redirect) {
        history.replace({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  /**
   * 格式为 (state, action) => newState 或 [(state, action) => newState, enhancer]。
   */
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
