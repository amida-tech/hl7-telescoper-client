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
    // TODO load saved username from localStorage on startup
    if (username !== undefined) {
      localStorage.setItem('username', username)
    } else {
      localStorage.removeItem('username')
    }
  }

  // HELP: there are currently two annoying things in this pattern
  //   1. `bind(this)` - without that, the function generator gets an undefined `this`
  //   2. explicitly declaring the type of `this` (`this: UserStore`) - without that, typescript doesn't understand the type of `this`
  // If you find a less manual way of getting both of the above, please implement it and show me :)
  signUp = flow((function * (this: UserStore, email: string, username: string, password: string) {
    // TODO factor out api calls as service
    // TODO config for url
    const signUpResponse: AxiosResponse<{ username: string }> = yield axios.post('http://localhost:4040/api/users', { email, username, password })
    const { username: resUsername } = signUpResponse.data
    this.setUsername(resUsername)
    return resUsername
  }).bind(this))
}

export const USER_STORE = 'userStore'
