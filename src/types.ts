import { Segment } from 'health-level-seven-parser'

export interface HL7File {
  id: string
  name: string
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
