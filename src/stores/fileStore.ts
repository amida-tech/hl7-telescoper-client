import { observable, action } from 'mobx';
import { telescoperApi } from '../services/api';
import { HL7File, HL7Message } from '../types';
import mockMessage from '../data/mockMessage';

export interface IFileStore {
  files: HL7File[];
  currentMessage?: HL7Message;
  setFiles(files: HL7File[]): void;
  setCurrentMessage(msg: HL7Message): void;
  getFiles(): Promise<void>;
  getMessage(fileId: string, messageIndexWithinFile: number): Promise<void>;
}

export class FileStore implements IFileStore {
  // TODO remove mock data
  @observable files: HL7File[] = [
    {
      _id: '1',
      createdAt: '2019-07-02T21:01:23.894Z',
      updatedAt: '2019-07-02T21:01:23.894Z',
      filename: 'test1',
    },
    {
      _id: '2',
      createdAt: '2019-07-02T21:01:23.894Z',
      updatedAt: '2019-07-02T21:01:23.894Z',
      filename: 'test2',
    },
  ]
  @observable currentMessage?: HL7Message = mockMessage as HL7Message

  @action.bound
  setFiles(files: HL7File[]) {
    this.files = files
  }
  @action.bound
  setCurrentMessage(msg: HL7Message) {
    this.currentMessage = msg
  }

  @action.bound
  async getFiles() {
    const files = await telescoperApi.getFiles()
    this.setFiles(files)
  }
  @action.bound
  async getMessage(fileId: string, messageIndexWithinFile: number) {
    const msg = await telescoperApi.getMessage(fileId, messageIndexWithinFile)
    this.setCurrentMessage(msg)
  }
}

export const FILE_STORE = 'fileStore'
