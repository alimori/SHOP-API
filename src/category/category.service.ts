import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) { }

  create(dto: CreateCategoryDto) {

    const category =
      this.categoryRepo.create(dto);

    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({
      relations: ['products'],
    });
  }


  async findOne(id: number) {

    const category =
      await this.categoryRepo.findOne({
        where: { id },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

    async findOnewithProducts(id: number) {

    const category =
      await this.categoryRepo.findOne({
        where: { id },

        relations: ['products'],
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ) {

    const category =
      await this.categoryRepo.preload({
        id,
        ...dto,
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return this.categoryRepo.save(category);
  }

  async remove(id: number) {

    const category =
      await this.categoryRepo.findOne({
        where: { id },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return this.categoryRepo.remove(category);
  }
}