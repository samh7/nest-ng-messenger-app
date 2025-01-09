import { IsNotEmpty, IsString } from "class-validator";

export class UpdatetChatHistorydDto{

    @IsString()
    @IsNotEmpty()
    currentUsername: string

    
    @IsString()
    @IsNotEmpty()
    newsUsername: string
}