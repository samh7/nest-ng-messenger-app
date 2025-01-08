import { IsNotEmpty, IsString } from "class-validator"

export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    text: string

    @IsString()
    @IsNotEmpty()
    senderUsername: string

    @IsString()
    @IsNotEmpty()
    receiverUsername: string
}
