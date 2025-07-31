export interface StockItemReport {
  productId: number;
  productName: string;
  category: string;
  currentQuantity: number;
  stockStatus: 'LOW' | 'MEDIUM' | 'HIGH' | 'OUT_OF_STOCK';
  lastUpdated: Date;
}

export interface StockReportData {
  totalProducts: number;
  lowStockItems: StockItemReport[];
  outOfStockItems: StockItemReport[];
  stockByCategory: {
    category: string;
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalQuantity: number;
  }[];
  stockSummary: {
    totalStock: number;
    averageStockPerProduct: number;
    lowStockThreshold: number;
  };
}

export class StockReportDto {
  constructor(
    public readonly data: StockReportData,
    public readonly generatedAt: Date,
  ) {}

  static create(data: StockReportData): StockReportDto {
    return new StockReportDto(data, new Date());
  }

  toJSON() {
    return {
      data: this.data,
      generatedAt: this.generatedAt,
    };
  }
}
