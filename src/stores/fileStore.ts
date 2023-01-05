import { makeAutoObservable } from 'mobx';
import { telescoperApi } from '../services/api';
import { HL7File, HL7Message } from '../types';

export interface IFileStore {
  files: HL7File[];
  currentMessage?: HL7Message;
  currentFile?: HL7File;
  setFiles(files: HL7File[]): void;
  setCurrentMessage(msg: HL7Message): void;
  getFiles(): Promise<void>;
  getFile(fileId: string): Promise<void>;
  setCurrentFile(file?: HL7File): void;
  getMessage(fileId: string, messageIndexWithinFile: number): Promise<void>;
}

export class FileStore implements IFileStore {
  files: HL7File[] = [];
  currentMessage?: HL7Message;
  currentFile?: HL7File;

  constructor() {
    makeAutoObservable(this);
  }

  setFiles(files: HL7File[]) {
    this.files = files;
  }

  setCurrentFile(file?: HL7File) {
    this.currentFile = file;
  }
  setCurrentMessage(msg: HL7Message) {
    this.currentMessage = msg;
  }

  async getFiles() {
    const files = await telescoperApi.getFiles();
    if (files) {
      this.setFiles(files);
    } else {
      this.setFiles([]);
    }
  }
  async getMessage(fileId: string, messageIndexWithinFile: number) {
    const msg = await telescoperApi.getMessage(fileId, messageIndexWithinFile);
    this.setCurrentMessage(msg);
  }

  async getFile(fileId: string) {
    const file = await telescoperApi.getFile(fileId);
    if (file) {
      this.setCurrentFile(file);
    } else {
      this.setCurrentFile(undefined);
    }
  }
}

export const FILE_STORE = 'fileStore';
