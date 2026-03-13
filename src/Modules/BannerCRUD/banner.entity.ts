import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Banners' })
export class BannerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 500 })
  imageLink: string;

  static createEntity(link: string): BannerEntity {
    const banner = new this();

    banner.imageLink = link;

    return banner;
  }
}
