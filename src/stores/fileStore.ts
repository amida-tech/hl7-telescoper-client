import { observable, action } from 'mobx';
import { telescoperApi } from '../services/api';
import { HL7File, HL7Message } from '../types';

export interface IFileStore {
  files: HL7File[];
  currentMessage?: HL7Message;
  file?: HL7File;
  setFiles(files: HL7File[]): void;
  setCurrentMessage(msg: HL7Message): void;
  getFiles(): Promise<void>;
  getFile(fileId: string): Promise<void>;
  setFile(file: HL7File): void;
  getMessage(fileId: string, messageIndexWithinFile: number): Promise<void>;
}

export class FileStore implements IFileStore {
  @observable files: HL7File[] = []
  @observable currentMessage?: HL7Message
  @observable file?: HL7File

  @action.bound
  setFiles(files: HL7File[]) {
    this.files = files
  }

  @action.bound
  setFile(file: HL7File) {
    this.file = file
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

  @action.bound
  async getFile(fileId: string) {
    const file = await telescoperApi.getFile(fileId)
    if (file) {
      this.setFile(file)
    } else {
      this.setFile({id: '', filename: ''})
    }
  }
}

export const FILE_STORE = 'fileStore'
