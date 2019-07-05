import React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { inject, observer } from 'mobx-react';

import { IUserStore, USER_STORE } from '../stores/userStore';
import { FilesPage } from './FilesPage';

const AppRootImpl: React.FC<RouteComponentProps & { userStore: IUserStore }> = (props) => {
  const { match, userStore} = props
  const { isLoggedIn } = userStore
  if (!isLoggedIn) {
    return <Redirect to="/auth" />
  }
  return (
    <Switch>
      <Route path={`${match.path}/files`} component={FilesPage} />
      {/* <Route path={`${match.path}/files/upload`} component={FileUploadPage} />
      <Route path={`${match.path}/files/:fileId`} component={FilePage} /> */}
      <Redirect to={`${match.path}/files`} />
    </Switch>
  );
}

export const AppRoot = inject(USER_STORE)(observer(AppRootImpl))
