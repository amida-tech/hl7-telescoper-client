export interface HL7File {
  id: string
  createdAt: string
  updatedAt: string
  filename: string
  messages?: HL7Message[]
}

export interface HL7Message {
  raw: string
  parsed: {
    // TODO
  }
}
