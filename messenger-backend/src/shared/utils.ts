import { Message } from "src/messages/entities/message.entity";

export function sortMessages(
    messages: Message[],
) {

    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return messages.reverse();
}