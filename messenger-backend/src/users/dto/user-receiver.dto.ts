import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserReceiverDto {

    @IsString()
    @IsNotEmpty()
    senderUsername: string

    @IsString()
    @IsOptional()
    receiverUsername: string


}
