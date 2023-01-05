import React from 'react';
import { Routes, Route, Navigate, RouteProps } from 'react-router-dom';

import { IUserStore } from '../stores/userStore';

import { SignUpPage } from './SignUpPage';
import { LoginPage } from './LoginPage';

export const AuthRoot: React.FC<RouteProps & { userStore: IUserStore } | any> = (props) => {
  return (
    <Routes>
      <Route path="signup" element={<SignUpPage {...props} />} />
      <Route path="login" element={<LoginPage {...props} />} />
      <Route path="/auth/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
