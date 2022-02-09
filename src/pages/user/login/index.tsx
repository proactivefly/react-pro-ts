import {
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  UserOutlined,
} from '@ant-design/icons';


import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { getFakeCaptcha, LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import styles from './index.less';


interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
  submitLogin:any
}

const LoginMessage: React.FC<{content: string;}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
); 

// React.FC是 React.FunctionComponent的缩写
const Login: React.FC<LoginProps> = (props) => {

  // props中包含了 model层给的userLogin，和 submitiing
  // console.log('一个组件具备的所有参数props',props)
  const { userLogin = {}, submitting } = props;

  // store中登录状态，!!!!!对type重命名为loginType
  const { status, type:loginType } = userLogin;

  // console.log(status,loginType)


  // 给type初始值为’account‘
  const [type, setType] = useState<string>('account');


  const handleSubmit = (values: LoginParamsType) => {
    const { /* dispatch, */submitLogin } = props;
    /* dispatch({
      type: 'login/login',
      payload: { ...values, type },
    }); */
    submitLogin({...values,type})
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          handleSubmit(values);
        }}
      >
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="account"
            tab='账户密码登录'
          />
          <Tabs.TabPane
            key="mobile"
            tab='手机号登录'
          />
        </Tabs>

        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage
            content={'账户或密码错误（admin/ant.design)'}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="userName"
              initialValue="admin"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder='用户名: admin or user'
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              initialValue="ant.design"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon} />,
              }}
              placeholder='密码: ant.design'
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>
        )}

        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {/* 手机号正则校验 */}
        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileTwoTone className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '手机号是必填项！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '不合法的手机号！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder='请输入验证码'
              captchaTextRender={(timing, count) => timing?`${count}获取验证码`:'获取验证码'}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async (mobile) => {
                const result = await getFakeCaptcha(mobile);

                if (result === false) {
                  return;
                }

                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码 ?
          </a>
        </div>
      </ProForm>
    </div>
  );
};



/* 
	1.mapStateToProps函数返回的是一个对象；
	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
	3.mapStateToProps用于传递状态
*/
// function mapStateToProps(state){
// 	return {count:state}
// }

/* 
	1.mapDispatchToProps函数返回的是一个对象；
	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
	3.mapDispatchToProps用于传递操作状态的方法
*/
// function mapDispatchToProps(dispatch){
// 	return {
// 		jia:number => dispatch(createIncrementAction(number)),
// 		jian:number => dispatch(createDecrementAction(number)),
// 		jiaAsync:(number,time) => dispatch(createIncrementAsyncAction(number,time)),
// 	}
// }


export default connect(
  function (globalStore: ConnectState){
    // console.log('相当于是个全局的状态store',globalStore)
    return {
      userLogin: globalStore.login, // 登录状态
      submitting: globalStore.loading.effects['login/login'], //登录按钮状态
    }
  },
  function(dispatch:Dispatch){ //一般情况下不写，直接用dispatch!!!!!!!!
    // console.log('第二个函数')
    // console.log('action',dispatch)
    return {
      submitLogin:(payload:LoginParamsType)=>dispatch({
        type: 'login/login',
        payload: { ...payload },
      })
    }
  }
)(Login);
