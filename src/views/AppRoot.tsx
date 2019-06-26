import React from 'react';
import { Redirect, Switch, RouteComponentProps } from "react-router-dom";

export const AppRoot: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <Switch>
      {/* <Route path={`${match.path}/files`} component={FilesPage} />
      <Route path={`${match.path}/files/upload`} component={FileUploadPage} />
      <Route path={`${match.path}/files/:fileId`} component={FilePage} /> */}
      <Redirect to={`${match.path}/files`} />
    </Switch>
  );
}
