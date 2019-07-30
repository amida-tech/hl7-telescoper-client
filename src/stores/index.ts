import { USER_STORE, UserStore } from "./userStore";
import { FILE_STORE, FileStore } from "./fileStore";

export const stores = {
  [USER_STORE]: new UserStore(),
  [FILE_STORE]: new FileStore(),
}
