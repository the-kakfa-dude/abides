import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { PhotoInfo } from './PhotoInfo';
import { Author } from './Author';
import { Album } from './Album';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isPublished: boolean;

  @OneToOne(type => PhotoInfo, photoInfo => photoInfo.photo)
  info: PhotoInfo;

  @ManyToOne(type => Author, author => author.photos, { onDelete: 'CASCADE' })
  author: Author;

  @ManyToMany(type => Album, album => album.photos)
  albums: Album[];
}
