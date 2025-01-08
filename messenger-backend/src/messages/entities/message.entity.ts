import { BaseEntity } from "src/shared/base.entity";
import {  Column, Entity } from "typeorm";

@Entity("messages")
export class Message extends BaseEntity {
   
    @Column({ nullable: false })
    text: string

    @Column({ nullable: false })
    senderUsername: string

    @Column({ nullable: false })
    receiverUsername: string
}
