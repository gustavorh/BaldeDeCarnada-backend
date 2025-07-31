import { Injectable, Inject } from '@nestjs/common';
import { ProductRepositoryInterface } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { products } from '../database/schema';
import { eq, like, gt, and } from 'drizzle-orm';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  async findAll(): Promise<Product[]> {
    const result = await this.db.select().from(products);

    return result.map((product) =>
      Product.create({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        isActive: product.isActive ?? true,
        createdAt: product.createdAt ?? new Date(),
        updatedAt: product.updatedAt ?? new Date(),
      }),
    );
  }

  async findById(id: number): Promise<Product | null> {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const product = result[0];
    return Product.create({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      stock: product.stock,
      isActive: product.isActive ?? true,
      createdAt: product.createdAt ?? new Date(),
      updatedAt: product.updatedAt ?? new Date(),
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.category, category));

    return result.map((product) =>
      Product.create({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        isActive: product.isActive ?? true,
        createdAt: product.createdAt ?? new Date(),
        updatedAt: product.updatedAt ?? new Date(),
      }),
    );
  }

  async findByName(name: string): Promise<Product[]> {
    const result = await this.db
      .select()
      .from(products)
      .where(like(products.name, `%${name}%`));

    return result.map((product) =>
      Product.create({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        isActive: product.isActive ?? true,
        createdAt: product.createdAt ?? new Date(),
        updatedAt: product.updatedAt ?? new Date(),
      }),
    );
  }

  async findActiveProducts(): Promise<Product[]> {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.isActive, true));

    return result.map((product) =>
      Product.create({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        isActive: product.isActive ?? true,
        createdAt: product.createdAt ?? new Date(),
        updatedAt: product.updatedAt ?? new Date(),
      }),
    );
  }

  async findAvailableProducts(): Promise<Product[]> {
    const result = await this.db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), gt(products.stock, 0)));

    return result.map((product) =>
      Product.create({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        isActive: product.isActive ?? true,
        createdAt: product.createdAt ?? new Date(),
        updatedAt: product.updatedAt ?? new Date(),
      }),
    );
  }

  async create(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const result = await this.db.insert(products).values({
      name: productData.name,
      category: productData.category,
      price: productData.price.toString(),
      stock: productData.stock,
      isActive: productData.isActive,
    });

    // Get the created product
    const createdProduct = await this.findById(Number(result[0].insertId));
    if (!createdProduct) {
      throw new Error('Failed to create product');
    }

    return createdProduct;
  }

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    await this.db
      .update(products)
      .set({
        ...(productData.name && { name: productData.name }),
        ...(productData.category && { category: productData.category }),
        ...(productData.price && { price: productData.price.toString() }),
        ...(productData.stock !== undefined && { stock: productData.stock }),
        ...(productData.isActive !== undefined && { isActive: productData.isActive }),
      })
      .where(eq(products.id, id));

    return this.findById(id);
  }

  async updateStock(id: number, newStock: number): Promise<Product | null> {
    await this.db
      .update(products)
      .set({ stock: newStock })
      .where(eq(products.id, id));

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(products)
      .where(eq(products.id, id));

    return result[0].affectedRows > 0;
  }

  async deactivate(id: number): Promise<Product | null> {
    await this.db
      .update(products)
      .set({ isActive: false })
      .where(eq(products.id, id));

    return this.findById(id);
  }
}
