import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOkWrappedResponse } from 'src/common/dto/api-ok-response.decorator';

@ApiTags('Categories')
@Public()
@Controller('categories')
export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create category',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  create(
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiOkWrappedResponse(CreateCategoryDto)
  @ApiOperation({
    summary: 'Get all categories',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Category by id',
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Get(':id/products')
  @ApiOperation({
    summary: 'Get category with products by id',
  })
  findOnewithProducts(@Param('id') id: string) {
    return this.categoryService.findOnewithProducts(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update category',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.remove(id);
  }
}
