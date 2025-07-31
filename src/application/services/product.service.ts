import { Inject, Injectable } from '@nestjs/common';
import { IProductService } from '../../domain/services/product.service.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepositoryInterface } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }

  async searchProductsByName(name: string): Promise<Product[]> {
    return await this.productRepository.findByName(name);
  }

  async getActiveProducts(): Promise<Product[]> {
    return await this.productRepository.findActiveProducts();
  }

  async getAvailableProducts(): Promise<Product[]> {
    return await this.productRepository.findAvailableProducts();
  }

  async createProduct(product: Product): Promise<Product> {
    // Check if a product with the same name already exists
    const existingProducts = await this.productRepository.findByName(product.name);
    const exactMatch = existingProducts.find(p => p.name.toLowerCase() === product.name.toLowerCase());
    
    if (exactMatch) {
      throw new Error('Product with this name already exists');
    }

    // Validate product data
    if (product.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (product.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    return await this.productRepository.create(product);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Validate updated data
    if (product.price !== undefined && product.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (product.stock !== undefined && product.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    // Check for name conflicts if name is being updated
    if (product.name && product.name !== existingProduct.name) {
      const existingProducts = await this.productRepository.findByName(product.name);
      const exactMatch = existingProducts.find(p => p.name.toLowerCase() === product.name!.toLowerCase() && p.id !== id);
      
      if (exactMatch) {
        throw new Error('Product with this name already exists');
      }
    }

    return await this.productRepository.update(id, product);
  }

  async updateProductStock(id: number, newStock: number): Promise<Product | null> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (newStock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    return await this.productRepository.updateStock(id, newStock);
  }

  async deactivateProduct(id: number): Promise<Product | null> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return await this.productRepository.deactivate(id);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return await this.productRepository.delete(id);
  }
}
