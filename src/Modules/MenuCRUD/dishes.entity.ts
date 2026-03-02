import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DishInputModel, DishViewModel } from './menu.dto';

@Entity({ name: 'Dishes' })
export class DishEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 1000 })
  description: string;

  @Column()
  price: number;

  @Column('varchar', { length: 500 })
  imageLink: string;

  @Column('varchar', { length: 70 })
  category: string; //TODO enum?

  @Column()
  isActive: boolean;

  @Column()
  isSpicy: boolean;

  static createEntry(input: DishInputModel, link: string): DishEntity {
    const dish = new this();
    dish.name = input.name;
    dish.description = input.description;
    dish.price = input.price;
    dish.category = input.category;
    dish.isSpicy = input.isSpicy;

    dish.imageLink = link;
    dish.isActive = true;

    return dish;
  }

  setActiveState(newState: boolean): void {
    this.isActive = newState;
  }

  mapToViewModel(): DishViewModel {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      isSpicy: this.isSpicy,
      price: this.price,
      imageLink: this.imageLink,
      isActive: this.isActive,
    };
  }
}
