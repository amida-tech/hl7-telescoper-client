import { observable, action, computed, flow } from 'mobx';
import axios, { AxiosResponse } from 'axios';

export interface IUserStore {
  username?: string;
  isLoggedIn: boolean;
  setUsername(username?: string): void;
  signUp(email: string, username: string, password: string): Promise<string>;
}

export class UserStore implements IUserStore {
  @observable username: string | undefined = undefined;

  @computed
  public get isLoggedIn(): boolean {
    return this.username !== undefined;
  }

  @action.bound
  public setUsername(username?: string): void {
    this.username = username;
  }

  signUp = flow(function * (email: string, username: string, password: string) {
    // TODO factor out api calls as service
    // TODO config for url
    const signUpResponse: AxiosResponse<{ username: string }> = yield axios.post('http://localhost:4040/api/users', { email, username, password })
    return signUpResponse.data.username
  })
}

export const USER_STORE = 'userStore'
