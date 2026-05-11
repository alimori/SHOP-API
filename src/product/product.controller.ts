import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe, Res, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create product' })
    @ApiResponse({ status: 201, description: 'Product created' })
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get products with pagination',
    })
    @ApiQuery({
        name: 'skip',
        required: false,
        example: 0,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        example: 10,
    })
    findAll(
        @Query() query: PaginationQueryDto,
    ) {

        return this.productService.findAll(
            query.skip,
            query.limit,
        );
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update product' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateProductDto,
    ) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }

}