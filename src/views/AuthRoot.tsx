import React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { SignUpPage } from './SignUpPage';
import { LoginPage } from './LoginPage';

export const AuthRoot: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.path}/signup`} component={SignUpPage} />
      <Route path={`${match.path}/login`} component={LoginPage} />
      <Redirect to={`${match.path}/login`} />
    </Switch>
  );
};
