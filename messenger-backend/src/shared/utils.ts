import { Message } from "src/messages/entities/message.entity";

export function sortMessages(
    messages: Message[],
) {

    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return messages.reverse();
}

export function filterChatHistory(usernames: string[]) {

    return usernames.filter((item, index) => usernames.indexOf(item) === index);

}
export function extractUsernames(messages: Message[]): string[] {
    // Use a Set to ensure unique usernames
    const usernames = new Set<string>();

    messages.forEach(message => {
        if (message.senderUsername) {
            usernames.add(message.senderUsername.trim());
        }
        if (message.receiverUsername) {
            usernames.add(message.receiverUsername.trim());
        }
    });

    // Convert Set to Array and return
    return Array.from(usernames);
}