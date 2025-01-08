import { IsNotEmpty, IsString } from "class-validator";

export class UserReceiverDto {

    @IsString()
    @IsNotEmpty()
    senderUsername: string

    @IsString()
    @IsNotEmpty()
    receiverUsername: string


}
