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
  @observable files: HL7File[] = []
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
    if (files) {
      this.setFiles(files)
    } else {
      this.setFiles([])
    }
  }
  @action.bound
  async getMessage(fileId: string, messageIndexWithinFile: number) {
    const msg = await telescoperApi.getMessage(fileId, messageIndexWithinFile)
    this.setCurrentMessage(msg)
  }
}

export const FILE_STORE = 'fileStore'
