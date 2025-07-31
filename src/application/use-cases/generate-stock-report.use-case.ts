import { Inject, Injectable } from '@nestjs/common';
import { StockReportDto, StockReportData, StockItemReport } from '../../domain/dtos/stock-report.dto';
import { StockRepositoryInterface } from '../../domain/repositories/stock.repository.interface';
import { ProductRepositoryInterface } from '../../domain/repositories/product.repository.interface';
import { Stock } from '../../domain/entities/stock.entity';

@Injectable()
export class GenerateStockReportUseCase {
  constructor(
    @Inject('StockRepositoryInterface')
    private readonly stockRepository: StockRepositoryInterface,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(lowStockThreshold: number = 10): Promise<StockReportDto> {
    if (lowStockThreshold < 0) {
      throw new Error('Low stock threshold cannot be negative');
    }

    // Get all stock and product data
    const allStock = await this.stockRepository.findAll();
    const allProducts = await this.productRepository.findAll();

    // Create a map for quick product lookup
    const productMap = new Map(allProducts.map(p => [p.id, p]));

    // Process stock items
    const stockItems: StockItemReport[] = [];
    const categoryMap = new Map<string, {
      totalProducts: number;
      lowStockCount: number;
      outOfStockCount: number;
      totalQuantity: number;
    }>();

    let totalStock = 0;

    for (const stock of allStock) {
      const product = productMap.get(stock.productId);
      if (!product) continue; // Skip if product not found

      const stockStatus = this.determineStockStatus(stock.currentQuantity, lowStockThreshold);
      
      const stockItem: StockItemReport = {
        productId: stock.productId,
        productName: product.name,
        category: product.category,
        currentQuantity: stock.currentQuantity,
        stockStatus,
        lastUpdated: stock.updatedAt,
      };

      stockItems.push(stockItem);
      totalStock += stock.currentQuantity;

      // Update category statistics
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          totalProducts: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
          totalQuantity: 0,
        });
      }

      const categoryData = categoryMap.get(product.category)!;
      categoryData.totalProducts += 1;
      categoryData.totalQuantity += stock.currentQuantity;

      if (stockStatus === 'OUT_OF_STOCK') {
        categoryData.outOfStockCount += 1;
      } else if (stockStatus === 'LOW') {
        categoryData.lowStockCount += 1;
      }
    }

    // Filter items by stock status
    const lowStockItems = stockItems.filter(item => item.stockStatus === 'LOW');
    const outOfStockItems = stockItems.filter(item => item.stockStatus === 'OUT_OF_STOCK');

    // Convert category map to array
    const stockByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      totalProducts: data.totalProducts,
      lowStockCount: data.lowStockCount,
      outOfStockCount: data.outOfStockCount,
      totalQuantity: data.totalQuantity,
    }));

    // Calculate summary metrics
    const totalProducts = stockItems.length;
    const averageStockPerProduct = totalProducts > 0 ? totalStock / totalProducts : 0;

    const reportData: StockReportData = {
      totalProducts,
      lowStockItems: lowStockItems.sort((a, b) => a.currentQuantity - b.currentQuantity),
      outOfStockItems: outOfStockItems.sort((a, b) => a.productName.localeCompare(b.productName)),
      stockByCategory: stockByCategory.sort((a, b) => b.totalQuantity - a.totalQuantity),
      stockSummary: {
        totalStock,
        averageStockPerProduct: Math.round(averageStockPerProduct * 100) / 100,
        lowStockThreshold,
      },
    };

    return StockReportDto.create(reportData);
  }

  private determineStockStatus(quantity: number, threshold: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'OUT_OF_STOCK' {
    if (quantity === 0) {
      return 'OUT_OF_STOCK';
    } else if (quantity <= threshold) {
      return 'LOW';
    } else if (quantity <= threshold * 2) {
      return 'MEDIUM';
    } else {
      return 'HIGH';
    }
  }
}
