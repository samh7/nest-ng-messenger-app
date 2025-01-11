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

export function extractUsernamesSender(messages: Message[]): string[] {
    // Use a Set to ensure unique usernames
    const usernames = new Set<string>();

    messages.forEach(message => {
        // Exclude messages where the sender or receiver is the specified username

        if (message.senderUsername) {
            usernames.add(message.senderUsername.trim());
        }

    });

    // Convert Set to Array and return
    return Array.from(usernames);
}

export function extractUsernamesReceiver(messages: Message[]): string[] {
    // Use a Set to ensure unique usernames
    const usernames = new Set<string>();

    messages.forEach(message => {
        // Exclude messages where the sender or receiver is the specified username

    
        if (message.receiverUsername) {
            usernames.add(message.receiverUsername.trim());
        }
    });

    // Convert Set to Array and return
    return Array.from(usernames);
}
