import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    fileName: string;

    @Column()
    fileUrl: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @Column({ nullable: true })
    documentName: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploadedById' })
    uploadedBy: User;

    @ManyToOne(() => User )
    @JoinColumn({ name: 'updatedById' })
    updatedBy: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}
