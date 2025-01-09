import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    text: string

    @IsString()
    @IsNotEmpty()
    senderUsername: string

    @IsString()
    @IsOptional()
    receiverUsername: string
}
