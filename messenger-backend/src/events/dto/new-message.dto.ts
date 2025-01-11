import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Message } from "src/messages/entities/message.entity";

export class NewMessageDto {
    @IsString()
    @IsNotEmpty()
    senderUsername: string

    @IsString()
    @IsOptional()
    receiverUsername: string

    @IsString()
    @IsNotEmpty()
    message: Message
}