import { BaseEntity } from "src/shared/base.entity";
import { Column, Entity } from "typeorm";

@Entity("messages")
export class Message extends BaseEntity {


    // @Column({ nullable: true })
    // replyId: string


    @Column({ nullable: false })
    text: string

    @Column({ nullable: false })
    senderUsername: string

    @Column({ nullable: true })
    receiverUsername: string
}
