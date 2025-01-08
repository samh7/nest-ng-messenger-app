import { Exclude } from "class-transformer";
import { BaseEntity } from "src/shared/base.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity {

    
    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ unique: true })
    username: string;

}