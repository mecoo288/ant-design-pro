import React from 'react';
import { ConnectProps, Redirect, connect } from 'umi';
import Authorized from '@src/utils/Authorized';
import { ConnectState, Route, UserModelState } from '@src/models/connect';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { currentUser } = user;
  const { routes = [] } = route;
  const isLogin = currentUser && currentUser.name;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(AuthComponent);
