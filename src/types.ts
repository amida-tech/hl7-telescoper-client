import { Segment } from '@amida-tech/hl7-parser';

export interface HL7File {
  id: string
  filename: string
}

export interface HL7Message {
  _id: string
  createdAt: string
  updatedAt: string
  fileId: string
  messageNumWithinFile: number
  rawMessage: string
  parsedMessage: Segment[]
}
