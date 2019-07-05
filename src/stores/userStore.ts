import { observable, action, computed } from 'mobx';
import { telescoperApi } from '../services/api';

export interface IUserStore {
  username?: string;
  isLoggedIn: boolean;
  setUsername(username?: string): void;
  signUp(email: string, username: string, password: string): Promise<void>;
}

export class UserStore implements IUserStore {
  @observable username: string | undefined = undefined;

  @computed
  get isLoggedIn(): boolean {
    return this.username !== undefined;
  }

  @action.bound
  setUsername(username?: string): void {
    this.username = username;
    // TODO load saved username from localStorage on startup
    if (username !== undefined) {
      localStorage.setItem('username', username)
    } else {
      localStorage.removeItem('username')
    }
    telescoperApi.setToken(username)
  }

  @action.bound
  async signUp(email: string, username: string, password: string) {
    const { username: resUsername } = await telescoperApi.signUp(email, username, password)
    this.setUsername(resUsername)
  }
}

export const USER_STORE = 'userStore'
