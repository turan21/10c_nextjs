# Database migration

## 1. Install necessary packages

First, install the packages you'll need:

```bash
npm install @vercel/postgres prisma @prisma/client
# or
yarn add @vercel/postgres prisma @prisma/client
```

## 2. Set up Prisma

Initialize Prisma in your project:

```bash
npx prisma init
```

## 3. Configure your schema.prisma file

Replace the content of the generated `prisma/schema.prisma` file with your schema:

```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
  // Include other connection strings from Vercel
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @map("created_at")
  orders    Order[]
}

model Category {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  products    Product[]
}

model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String?
  price       Decimal
  stock       Int
  categoryId  Int         @map("category_id")
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id        Int         @id @default(autoincrement())
  userId    Int         @map("user_id")
  orderDate DateTime    @map("order_date")
  status    String
  total     Decimal
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int     @map("order_id")
  productId Int     @map("product_id")
  quantity  Int
  price     Decimal
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

## 4. Configure environment variables

Create or update your `.env` file with the Vercel Postgres connection strings:

```bash
POSTGRES_URL="your_vercel_postgres_url"
POSTGRES_URL_NON_POOLING="your_vercel_postgres_direct_url"
POSTGRES_USER="your_postgres_user"
POSTGRES_PASSWORD="your_postgres_password"
POSTGRES_HOST="your_postgres_host"
POSTGRES_DATABASE="your_database_name"
```

You can find these values in your Vercel dashboard under Project → Settings → Database.

## 5. Generate Prisma client and create migration

Generate the migration files:

```bash
npx prisma migrate dev --name init
```

This command will:

1. Create a migration file based on your schema
2. Apply the migration to your database
3. Generate the Prisma client

## 6. Deploy to Vercel

When you deploy your app to Vercel, make sure to add all the environment variables in your Vercel project settings.

To run migrations during deployment, you can add a build command in your `package.json`:

```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

## 7. Using the database in your application

Create a file like `lib/db.ts` to set up your Prisma client:

```tsx

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

```

Then you can import and use it in your API routes or server components:

```tsx
import { prisma } from '../lib/db'

// Example: Get all products
const products = await prisma.product.findMany({
  include: { category: true }
})
```