import { observable, action, computed } from 'mobx';
import { telescoperApi } from '../services/api';

const TOKEN_STORAGE_KEY = 'token'

export interface IUserStore {
  token?: string;
  rehydrated: boolean;
  isLoggedIn: boolean;
  rehydrate(): void;
  setToken(token?: string): void;
  signUp(email: string, username: string, password: string): Promise<void>;
  login(username: string, password: string): Promise<void>;
}

export class UserStore implements IUserStore {
  @observable token: string | undefined = undefined;
  @observable rehydrated: boolean = false;

  @computed
  get isLoggedIn(): boolean {
    return this.token !== undefined;
  }

  @action.bound
  rehydrate() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      this.setToken(token)
    }
    this.rehydrated = true
  }

  @action.bound
  setToken(token?: string) {
    this.token = token;
    if (token !== undefined) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    telescoperApi.setToken(token)
  }

  @action.bound
  logout() {
    this.setToken(undefined)
  }

  @action.bound
  async signUp(email: string, username: string, password: string) {
    await telescoperApi.signUp(email, username, password)
  }
  @action.bound
  async login(username: string, password: string) {
    const { token } = await telescoperApi.login(username, password)
    this.setToken(token)
  }
}

export const USER_STORE = 'userStore'
