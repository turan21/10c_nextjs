# Next.js CRUD API with Prisma PostgreSQL

This guide will walk you through creating a CRUD (Create, Read, Update, Delete) API in a Next.js project with Prisma and PostgreSQL already set up in a Vercel environment. We'll implement APIs for User, Product, and Order entities.

## Prerequisites

- Next.js project already set up
- Prisma PostgreSQL database connected in Vercel
- Basic knowledge of Next.js and API routes

## Table of Contents

1. [Setting Up the Schema](#1-setting-up-the-schema)
2. [Creating API Routes for Users](#2-creating-api-routes-for-users)
3. [Creating API Routes for Products](#3-creating-api-routes-for-products)
4. [Creating API Routes for Orders](#4-creating-api-routes-for-orders)
5. [Testing Your API](#5-testing-your-api)
6. [Best Practices and Optimization](#6-best-practices-and-optimization)

## 1. Setting Up the Schema

First, let's define our database schema for User, Product, and Order in the Prisma schema file (`prisma/schema.prisma`):

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String       @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int          @default(0)
  imageUrl    String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    OrderStatus @default(PENDING)
  total     Float
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  items     OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

After updating the schema, run the following command to apply the changes to your database:

```bash
npx prisma db push
```

## 2. Creating API Routes for Users

Next.js provides an API Routes feature that allows you to build your API endpoints as serverless functions. Let's create the CRUD operations for Users.

### Step 1: Create a Prisma client utility

Create a file `lib/prisma.js` to set up the Prisma client:

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

### Step 2: Create API routes for User

Create the following files in the `app/api/users` directory:

#### Route handlers for User CRUD operations:

First, create the `app/api/users/route.js` file:

```javascript
// app/api/users/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create a new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
```

Now, create `app/api/users/[id]/route.js` for single user operations:

```javascript
// app/api/users/[id]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET single user
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { email, name, password } = body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
```

## 3. Creating API Routes for Products
# Products
### Step 1: Create Product API routes

Create `app/api/products/route.js`:

```javascript
// app/api/products/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl } = body;
    
    // Validate input
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
```

Create `app/api/products/[id]/route.js`:

```javascript
// app/api/products/[id]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, price, stock, imageUrl } = body;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete product
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
```

## 4. Creating API Routes for Orders
# Orders
### Step 1: Create Order API routes

Create `app/api/orders/route.js`:

```javascript
// app/api/orders/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items } = body;
    
    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'User ID and at least one item are required' }, { status: 400 });
    }
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Fetch products to verify and calculate total
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });
    
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products not found' }, { status: 404 });
    }
    
    // Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });
    
    // Calculate total and prepare order items
    let total = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.productId];
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
```

Create `app/api/orders/[id]/route.js`:

```javascript
// app/api/orders/[id]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET single order
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Delete order items first (due to foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });
    
    // Delete order
    await prisma.order.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
```

## 5. Testing Your API

You can test your API routes using tools like Apidog, Postman, Insomnia, or simply using `fetch` in your browser.

Here are some example API calls:

### User API Examples:

1. Create a user:
```
POST /api/users
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

2. Get all users:
```
GET /api/users
```

3. Get a single user:
```
GET /api/users/{userId}
```

4. Update a user:
```
PUT /api/users/{userId}
{
  "name": "John Smith"
}
```

5. Delete a user:
```
DELETE /api/users/{userId}
```

### Product API Examples:

1. Create a product:
```
POST /api/products
{
  "name": "Smartphone",
  "description": "Latest model with great features",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/images/smartphone.jpg"
}
```

2. Get all products:
```
GET /api/products
```

3. Get a single product:
```
GET /api/products/{productId}
```

4. Update a product:
```
PUT /api/products/{productId}
{
  "price": 899.99,
  "stock": 45
}
```

5. Delete a product:
```
DELETE /api/products/{productId}
```

### Order API Examples:

1. Create an order:
```
POST /api/orders
{
  "userId": "user-id-here",
  "items": [
    {
      "productId": "product-id-here",
      "quantity": 2
    },
    {
      "productId": "another-product-id",
      "quantity": 1
    }
  ]
}
```

2. Get all orders:
```
GET /api/orders
```

3. Get a single order:
```
GET /api/orders/{orderId}
```

4. Update an order status:
```
PUT /api/orders/{orderId}
{
  "status": "SHIPPED"
}
```

5. Delete an order:
```
DELETE /api/orders/{orderId}
```

## 6. Best Practices and Optimization

### Error Handling

We've implemented basic error handling in our API routes, but in a production environment, you might want to consider more robust error handling:

```javascript
// Example of more detailed error handling
try {
  // Your code here
} catch (error) {
  console.error('Error details:', error);
  
  if (error.code === 'P2002') {
    return NextResponse.json({ 
      error: 'A unique constraint would be violated on this record', 
      field: error.meta?.target?.[0] 
    }, { status: 409 });
  }
  
  return NextResponse.json({ 
    error: 'An unexpected error occurred', 
    message: process.env.NODE_ENV === 'development' ? error.message : undefined 
  }, { status: 500 });
}
```

### Pagination

For endpoints that might return a large number of records, consider implementing pagination:

```javascript
// Example of pagination for GET /api/products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      skip,
      take: limit,
    });
    
    const total = await prisma.product.count();
    
    return NextResponse.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

### Authentication and Authorization

In a real-world application, you should implement authentication and authorization for your API routes. You can use packages like NextAuth.js or implement your own middleware:

```javascript
// Example middleware for authentication
// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  // Paths that don't require authentication
  const publicPaths = ['/api/auth/login', '/api/auth/register'];
  
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  try {
    const user = await verifyToken(token);
    // You can attach the user to the request for use in route handlers
    request.user = user;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

### Input Validation

Consider using a validation library like Zod, Joi, or Yup for more robust input validation:

```javascript
// Example using Zod
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  password: z.string().min(8),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Continue with the validated data
    const { email, name, password } = validationResult.data;
    
    // Rest of the code...
  } catch (error) {
    // Error handling...
  }
}
```

### Caching

For read-heavy operations, consider implementing caching:

```javascript
// Example caching for GET /api/products
export async function GET() {
  try {
    // Check if data is in cache
    const cachedData = await redis.get('products');
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }
    
    // If not in cache, fetch from database
    const products = await prisma.product.findMany();
    
    // Store in cache for 5 minutes
    await redis.set('products', JSON.stringify(products), 'EX', 300);
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

### Database Transactions

For operations that involve multiple database updates, use transactions to ensure data integrity:

```javascript
// Example transaction for creating an order
const order = await prisma.$transaction(async (tx) => {
  // Create the order
  const newOrder = await tx.order.create({
    data: {
      userId,
      total,
      status: 'PENDING',
    },
  });
  
  // Create order items
  for (const item of orderItems) {
    await tx.orderItem.create({
      data: {
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      },
    });
    
    // Update product stock
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }
  
  return newOrder;
});
```

With these implementations and best practices, you now have a complete CRUD API for Users, Products, and Orders in your Next.js application with Prisma PostgreSQL.
