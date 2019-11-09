import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class PhotoInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  height: number;

  @Column('int')
  width: number;

  @Column()
  comment: string;

  @OneToOne(type => Photo, photo => photo.info, { onDelete: 'CASCADE' })
  @JoinColumn()
  photo: Photo;
}
