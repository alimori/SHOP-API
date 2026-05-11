import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe, Res, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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

    // @Get()
    // @ApiOperation({ summary: 'Get all products' })
    // findAll(@Query() paginationQuery, @Res() response,) {
    //     const { limit, offset } = paginationQuery;
    //     return this.productService.findAll();
    // }
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    findAll(@Query() paginationQuery) {
        const { skip, limit } = paginationQuery;
        return this.productService.findAll(+skip, +limit);
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