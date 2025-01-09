import { IsNotEmpty, IsString } from "class-validator";

export class ChatHistorydDto {

    @IsString()
    @IsNotEmpty()
    currentUserName:  string
}