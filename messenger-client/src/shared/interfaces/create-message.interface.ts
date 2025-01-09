export interface CreateMessageDto {
  text: string

  senderUsername: string

  receiverUsername?: string
}
