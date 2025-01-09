import { BaseEntity } from "src/shared/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("recent_user_chats")
export class RecentUserChats extends BaseEntity {
    @Column({type: "json"})
    userNames: string[]

    @Column()
    currentUserName: string

}