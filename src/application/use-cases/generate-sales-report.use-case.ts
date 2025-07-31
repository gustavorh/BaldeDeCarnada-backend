import { Inject, Injectable } from '@nestjs/common';
import { SalesReportDto, SalesReportData, ProductSalesData } from '../../domain/dtos/sales-report.dto';
import { OrderRepositoryInterface } from '../../domain/repositories/order.repository.interface';
import { ProductRepositoryInterface } from '../../domain/repositories/product.repository.interface';
import { Order, OrderProduct } from '../../domain/entities/order.entity';

@Injectable()
export class GenerateSalesReportUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<SalesReportDto> {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }

    // Get all orders within the date range
    const orders = await this.orderRepository.findAll();
    const filteredOrders = orders.filter(order => 
      order.orderDate >= startDate && order.orderDate <= endDate
    );

    // Calculate sales metrics
    const totalSales = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate product sales data
    const productSalesMap = new Map<number, {
      productId: number;
      productName: string;
      category: string;
      totalQuantity: number;
      totalRevenue: number;
      prices: number[];
    }>();

    // Process each order's products
    for (const order of filteredOrders) {
      for (const orderProduct of order.products) {
        const key = orderProduct.productId;
        
        if (!productSalesMap.has(key)) {
          productSalesMap.set(key, {
            productId: orderProduct.productId,
            productName: orderProduct.name,
            category: 'Unknown', // Will be updated below
            totalQuantity: 0,
            totalRevenue: 0,
            prices: [],
          });
        }

        const productData = productSalesMap.get(key)!;
        productData.totalQuantity += orderProduct.quantity;
        productData.totalRevenue += orderProduct.subtotal;
        productData.prices.push(orderProduct.price);
      }
    }

    // Get product details to fill in categories
    const allProducts = await this.productRepository.findAll();
    const productCategoryMap = new Map(allProducts.map(p => [p.id, p.category]));

    // Convert to ProductSalesData and calculate averages
    const topProducts: ProductSalesData[] = Array.from(productSalesMap.values())
      .map(data => ({
        productId: data.productId,
        productName: data.productName,
        category: productCategoryMap.get(data.productId) || 'Unknown',
        totalQuantitySold: data.totalQuantity,
        totalRevenue: data.totalRevenue,
        averagePrice: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
      }))
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);

    // Calculate sales by category
    const categoryMap = new Map<string, { totalQuantity: number; totalRevenue: number }>();
    
    for (const product of topProducts) {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, { totalQuantity: 0, totalRevenue: 0 });
      }
      
      const categoryData = categoryMap.get(product.category)!;
      categoryData.totalQuantity += product.totalQuantitySold;
      categoryData.totalRevenue += product.totalRevenue;
    }

    const salesByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      totalQuantity: data.totalQuantity,
      totalRevenue: data.totalRevenue,
    }));

    const reportData: SalesReportData = {
      totalSales,
      totalRevenue,
      reportPeriod: {
        startDate,
        endDate,
      },
      topProducts,
      salesByCategory,
    };

    return SalesReportDto.create(reportData);
  }
}
