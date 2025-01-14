import { IsNotEmpty, IsString } from "class-validator";

export class CreateReplyDto{
    @IsString()
    @IsNotEmpty()
    baseMessageId: string

    @IsString()
    @IsNotEmpty()
    replyMesssageId: string
}