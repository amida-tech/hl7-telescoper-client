import { observable, action, runInAction } from 'mobx';
import { telescoperApi } from '../services/api';
import { HL7File } from '../types';

export interface IFileStore {
  files: HL7File[]
}

export class FileStore implements IFileStore {
  // TODO remove mock data
  @observable files: HL7File[] = [
    {
      id: '1',
      createdAt: '2019-07-02T21:01:23.894Z',
      updatedAt: '2019-07-02T21:01:23.894Z',
      filename: 'test1',
    },
    {
      id: '2',
      createdAt: '2019-07-02T21:01:23.894Z',
      updatedAt: '2019-07-02T21:01:23.894Z',
      filename: 'test2',
    },
  ]

  @action.bound
  async getFiles() {
    const files = await telescoperApi.getFiles()
    runInAction(() => this.files = files)
  }
}

export const FILE_STORE = 'fileStore'
