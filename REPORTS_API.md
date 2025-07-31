# Reports API Documentation

This document describes the available report endpoints for the BaldeDeCarnada backend system.

## Available Endpoints

### 1. Sales Report
Get detailed sales information including top-selling products and sales by category.

**Endpoint:** `GET /reports/sales`

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Example:**
```
GET /reports/sales?startDate=2024-01-01&endDate=2024-01-31
```

**Response Structure:**
```json
{
  "data": {
    "totalSales": 150,
    "totalRevenue": 12500.00,
    "reportPeriod": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "topProducts": [
      {
        "productId": 1,
        "productName": "Product Name",
        "category": "Category",
        "totalQuantitySold": 50,
        "totalRevenue": 2500.00,
        "averagePrice": 50.00
      }
    ],
    "salesByCategory": [
      {
        "category": "Electronics",
        "totalQuantity": 100,
        "totalRevenue": 5000.00
      }
    ]
  },
  "generatedAt": "2024-01-31T12:00:00.000Z"
}
```

### 2. Sales Summary (Last N Days)
Get a quick sales summary for the last N days.

**Endpoint:** `GET /reports/sales/summary`

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Example:**
```
GET /reports/sales/summary?days=7
```

### 3. Attendance Report
Get detailed attendance information for all employees.

**Endpoint:** `GET /reports/attendance`

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Example:**
```
GET /reports/attendance?startDate=2024-01-01&endDate=2024-01-31
```

**Response Structure:**
```json
{
  "data": {
    "reportPeriod": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "totalEmployees": 10,
    "averageHoursPerEmployee": 160.5,
    "totalHoursAllEmployees": 1605.0,
    "employeeReports": [
      {
        "employeeId": 1,
        "totalDaysWorked": 22,
        "totalHoursWorked": 176.0,
        "averageHoursPerDay": 8.0,
        "attendanceRecords": [
          {
            "date": "2024-01-01T00:00:00.000Z",
            "checkInTime": "2024-01-01T09:00:00.000Z",
            "checkOutTime": "2024-01-01T17:00:00.000Z",
            "hoursWorked": 8.0
          }
        ]
      }
    ]
  },
  "generatedAt": "2024-01-31T12:00:00.000Z"
}
```

### 4. Attendance Summary (Last N Days)
Get a quick attendance summary for the last N days.

**Endpoint:** `GET /reports/attendance/summary`

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Example:**
```
GET /reports/attendance/summary?days=7
```

### 5. Stock Report
Get detailed stock information including low stock and out-of-stock items.

**Endpoint:** `GET /reports/stock`

**Query Parameters:**
- `threshold` (optional): Low stock threshold (default: 10)

**Example:**
```
GET /reports/stock?threshold=5
```

**Response Structure:**
```json
{
  "data": {
    "totalProducts": 100,
    "lowStockItems": [
      {
        "productId": 1,
        "productName": "Product Name",
        "category": "Category",
        "currentQuantity": 3,
        "stockStatus": "LOW",
        "lastUpdated": "2024-01-31T12:00:00.000Z"
      }
    ],
    "outOfStockItems": [],
    "stockByCategory": [
      {
        "category": "Electronics",
        "totalProducts": 50,
        "lowStockCount": 5,
        "outOfStockCount": 2,
        "totalQuantity": 500
      }
    ],
    "stockSummary": {
      "totalStock": 2500,
      "averageStockPerProduct": 25.0,
      "lowStockThreshold": 10
    }
  },
  "generatedAt": "2024-01-31T12:00:00.000Z"
}
```

## Stock Status Values
- `OUT_OF_STOCK`: Quantity is 0
- `LOW`: Quantity is between 1 and threshold
- `MEDIUM`: Quantity is between threshold+1 and threshold*2
- `HIGH`: Quantity is greater than threshold*2

## Error Responses
All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "statusCode": 400,
  "message": "Invalid date format. Please use YYYY-MM-DD format.",
  "error": "Bad Request"
}
```

## Usage Examples

### Get sales report for January 2024
```bash
curl -X GET "http://localhost:3000/reports/sales?startDate=2024-01-01&endDate=2024-01-31"
```

### Get last 7 days attendance summary
```bash
curl -X GET "http://localhost:3000/reports/attendance/summary?days=7"
```

### Get stock report with threshold of 5
```bash
curl -X GET "http://localhost:3000/reports/stock?threshold=5"
```
