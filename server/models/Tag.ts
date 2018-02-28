import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Video } from "./Video";

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => Video, videos => videos.tags)
  videos: Video[];
}
