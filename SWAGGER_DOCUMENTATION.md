# Swagger Documentation Implementation

## Overview
Swagger/OpenAPI documentation has been successfully added to the Balde de Carnada backend API. The documentation is now available at `/api/docs` when the server is running.

## What was implemented:

### 1. Swagger Setup
- Installed `@nestjs/swagger` and `swagger-ui-express` packages
- Configured Swagger in `main.ts` with proper API metadata
- Added API tags for different controller groups

### 2. DTOs Created
Created proper Data Transfer Objects for API documentation:

- **Common DTOs** (`src/presentation/dtos/common.dto.ts`):
  - `ApiResponseDto<T>` - Generic success response
  - `ErrorResponseDto` - Error response format

- **Auth DTOs** (`src/presentation/dtos/auth.dto.ts`):
  - `RegisterUserDto` - User registration
  - `LoginDto` - User login
  - `UserResponseDto` - User data response

- **Product DTOs** (`src/presentation/dtos/product.dto.ts`):
  - `CreateProductDto` - Product creation
  - `UpdateProductDto` - Product updates
  - `UpdateProductStockDto` - Stock updates
  - `ProductResponseDto` - Product data response

- **Stock DTOs** (`src/presentation/dtos/stock.dto.ts`):
  - `UpdateStockQuantityDto` - Stock quantity updates
  - `StockResponseDto` - Stock data response

- **Order DTOs** (`src/presentation/dtos/order.dto.ts`):
  - `OrderResponseDto` - Order data response
  - `OrderItemDto` - Order item details

- **Attendance DTOs** (`src/presentation/dtos/attendance.dto.ts`):
  - `CheckInDto` - Employee check-in
  - `CheckOutDto` - Employee check-out
  - `AttendanceResponseDto` - Attendance data response

### 3. Controllers Documented

#### Auth Controller (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login

#### Products Controller (`/api/products`)
- `GET /` - Get all products
- `GET /active` - Get active products
- `GET /available` - Get products with stock
- `GET /category/:category` - Get products by category
- `GET /search?name=` - Search products by name
- `GET /:id` - Get product by ID
- `POST /` - Create new product
- `PUT /:id` - Update product
- `PATCH /:id/stock` - Update product stock
- `PATCH /:id/deactivate` - Deactivate product
- `DELETE /:id` - Delete product

#### Stock Controller (`/api/stock`)
- `GET /` - Get all stock items

#### Orders Controller (`/api/orders`)
- `GET /` - Get all orders
- `GET /:id` - Get order by ID

#### Users Controller (`/api/users`)
- `GET /` - Get all users
- `POST /` - Create new user

#### Attendance Controller (`/api/attendance`)
- `GET /` - Get attendance records (with optional filters)
- `GET /:id` - Get attendance by ID
- `POST /check-in` - Register check-in
- `PUT /:id/check-out` - Register check-out
- `GET /employee/:employeeId/today` - Get today's attendance
- `DELETE /:id` - Delete attendance record

#### Reports Controller (`/api/reports`)
- `GET /sales` - Generate sales report

### 4. API Features Documented
- Request/Response schemas
- HTTP status codes
- Error responses
- Parameter descriptions
- Example values
- Required/optional fields

## How to Access

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api/docs
   ```

3. You'll see the complete Swagger UI with:
   - Interactive API documentation
   - Try-it-out functionality
   - Request/response examples
   - Schema definitions

## Benefits

- **Developer Experience**: Clear API documentation for frontend developers
- **Testing**: Interactive interface to test API endpoints
- **Validation**: Automatic request/response validation
- **Standards**: Follows OpenAPI 3.0 specification
- **Maintenance**: Self-documenting code with decorators

The API is now fully documented and ready for frontend integration and testing!
