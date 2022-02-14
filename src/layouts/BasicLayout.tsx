/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
 import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, Dispatch, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
// 权限鉴定!!!!
import Authorized from '@/utils/Authorized';

import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';

// 未匹配路由
const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);


/**
 * type 和 interface的区别 https://www.jb51.net/article/163299.htm
 */
// 定义interface
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

// type类接口

/**
 *  in 介绍 ：https://juejin.cn/post/6844904131975446536
 */
export type BasicLayoutContext = 
  { [K in 'location']: BasicLayoutProps[K] }
    & 
  {
    breadcrumbNameMap: {
      [path: string]: MenuDataItem;
    };
  };

/**
 * 
 * 检验菜单权限方法
 * use Authorized check all menu item
 */


// item为MenuDataItem的数组，返回值也是item为MenuDataItem的数组 

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>{
  // console.log('meunList------->',menuList)
  return menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    // todo 对菜单鉴权， 下方as 为ts中类型断言
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
}
  

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 蚂蚁集团体验技术部出品`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

//#region 
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  console.log('BasicLayoutProps------>',props)
  const { 
    dispatch, 
    children, 
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  
  const menuDataRef = useRef<MenuDataItem[]>([]);

  /*  
  作为componentDidMount使用，[]变化执行，空数组只在初次渲染后执行
  作为componentDidUpdate使用，[n,m]n和m变化执行，初始化n和m也是变化，由undifined变成初始值，可设置判断条件，消除初始变化
  */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; 


  /**
   * useMemo 和 useCallback的区别
   * https://blog.csdn.net/a5534789/article/details/103775109
   * 
   * url发生变化时触发验证，用于缓存数据，优化性能
   */

  const authorized = useMemo(
    () =>{
      return (
        getMatchMenu(location.pathname || '/', menuDataRef.current).pop() 
        || 
        {authority: undefined}
      )
    },
    [location.pathname]
  );
  console.log('autoorized-----',authorized)


  /* let a={
    a:['admin']
  }
  console.log('这是什么语法',a!.a) */

  
  return (
    <ProLayout
      logo={logo}
      {...props}
      {...settings}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};
//#endregion


// connect一系列骚操作
export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);