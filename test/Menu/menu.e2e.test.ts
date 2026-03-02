import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MenuModule } from '../../src/Modules/MenuCRUD/menu.module';
import { DishesRepository } from '../../src/Modules/MenuCRUD/dishes.repository';
import { testDish } from './menu.helpers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../src/Settings/config';
import {
  IMAGE_STORAGE,
  ImageStorage,
} from '../../src/Modules/Adapters/ImageStorage/image-storage.interface';
import { StorageModule } from '../../src/Modules/Adapters/ImageStorage/storage.module';
import { DishViewModel } from '../../src/Modules/MenuCRUD/menu.dto';
import { TypeormConfig } from '../../typeorm.config';

describe('Menu CRUD', () => {
  let app: INestApplication;
  let repository: DishesRepository;
  let imageStorage: ImageStorage;
  let dishId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeormConfig),
        StorageModule,
        MenuModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    repository = moduleRef.get(DishesRepository);
    imageStorage = moduleRef.get(IMAGE_STORAGE);
    await repository.deleteAll();
    await imageStorage.deleteAll();
  });

  it(`/POST menu`, async () => {
    return request(app.getHttpServer())
      .post('/menu')
      .send(testDish)
      .expect(201)
      .then((response) => {
        dishId = response.body.id as number;
        expect(Number.isInteger(dishId)).toBe(true);
      });
  });

  it(`/GET menu`, async () => {
    return request(app.getHttpServer())
      .get('/menu')
      .expect(200)
      .then(async (response) => {
        const dish = response.body.dishes[0] as DishViewModel;
        expect(dish.name).toBe(testDish.name);
        expect(dish.description).toBe(testDish.description);
        expect(dish.price).toBe(testDish.price);
        expect(dish.isSpicy).toBe(testDish.isSpicy);
        const res = await fetch(dish.imageLink);
        expect(res.headers.get('content-type')).toBe('image/png');
      });
  });

  it(`/PUT menu`, async () => {
    return request(app.getHttpServer())
      .put(`/menu/${dishId}/status?status=false`)
      .expect(204)
      .then(async (_res) => {
        expect((await repository.findById(dishId))!.isActive).toBe(false);
      });
  });

  it(`/DELETE menu`, async () => {
    return request(app.getHttpServer())
      .delete('/menu/' + dishId)
      .expect(204)
      .then(async (_res) => {
        expect(await repository.findById(dishId)).toBeNull();
      });
  });

  afterAll(async () => {
    await repository.deleteAll();
    await imageStorage.deleteAll();
    await app.close();
  });
});
