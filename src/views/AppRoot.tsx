import React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { inject, observer } from 'mobx-react';

import { IUserStore, USER_STORE } from '../stores/userStore';
import { FilesPage } from './FilesPage';
import { MessagePage } from './MessagePage';
import { FileUploadPage } from './FileUploadPage';

const AppRootImpl: React.FC<RouteComponentProps & { userStore: IUserStore }> = (props) => {
  const { match, userStore} = props
  const { isLoggedIn } = userStore
  if (!isLoggedIn) {
    return <Redirect to="/auth" />
  }
  return (
    <Switch>
      <Route path={`${match.path}/files/upload`} component={FileUploadPage} />
      <Route path={`${match.path}/files/:fileId/messages/:messageIndex`} component={MessagePage} />
      <Redirect from={`${match.path}/files/:fileId`} to={`${match.path}/files/:fileId/messages/0`} />
      <Route path={`${match.path}/files`} component={FilesPage} />
      <Redirect to={`${match.path}/files`} />
    </Switch>
  );
}

export const AppRoot = inject(USER_STORE)(observer(AppRootImpl))
