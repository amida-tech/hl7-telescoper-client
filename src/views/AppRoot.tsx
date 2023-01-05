import React, { useEffect } from 'react';
import { Routes, Route, RouteProps, useNavigate, Navigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { IUserStore, USER_STORE } from '../stores/userStore';
import { IFileStore } from '../stores/fileStore';

import { FilesPage } from './FilesPage';
import { MessagePage } from './MessagePage';
import { FileUploadPage } from './FileUploadPage';

const AppRootImpl: React.FC<RouteProps & { userStore: IUserStore } & { fileStore: IFileStore }> = (props) => {
  const { userStore } = props;
  const nav = useNavigate();
  useEffect(() => {
    if (!userStore.isLoggedIn) {
      nav('/auth/login', { replace: true });
    }
  }, [nav, userStore.isLoggedIn]);
  return (
    <Routes>
      <Route path="files/:fileId/messages/:messageIndex" element={<MessagePage {...props} />} />
      <Route path="files/:fileId" element={<Navigate to="messages/0" />} />
      <Route path="files/upload" element={<FileUploadPage />} />
      <Route path="files" element={<FilesPage {...props} />} />
    </Routes>
  );
};

export const AppRoot = inject(USER_STORE)(observer(AppRootImpl));
