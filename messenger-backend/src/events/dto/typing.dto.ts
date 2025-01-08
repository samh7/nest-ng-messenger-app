import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class TypingDto {

    @IsString()
    @IsNotEmpty()
    username: string

    @IsBoolean()
    @IsNotEmpty()
    isTyping: boolean
}