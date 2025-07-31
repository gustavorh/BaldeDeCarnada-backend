export interface ProductSalesData {
  productId: number;
  productName: string;
  category: string;
  totalQuantitySold: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface SalesReportData {
  totalSales: number;
  totalRevenue: number;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  topProducts: ProductSalesData[];
  salesByCategory: {
    category: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
}

export class SalesReportDto {
  constructor(
    public readonly data: SalesReportData,
    public readonly generatedAt: Date,
  ) {}

  static create(data: SalesReportData): SalesReportDto {
    return new SalesReportDto(data, new Date());
  }

  toJSON() {
    return {
      data: this.data,
      generatedAt: this.generatedAt,
    };
  }
}
