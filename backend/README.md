# Eyewear E-commerce Backend API

Production-ready FastAPI backend for the eyewear e-commerce store.

## Features

- **Authentication**: JWT-based auth with Google OAuth support
- **Products**: Full CRUD with categories, filtering, and search
- **Cart**: Shopping cart management with variants
- **Orders**: Complete order lifecycle management
- **User Profile**: Profile management and wishlist
- **Security**: CORS, password hashing, token refresh

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Generate secure keys
python -c "import secrets; print(secrets.token_urlsafe(32))"
python -c "import secrets; print(secrets.token_hex(32))"
```

Update `.env` with:
- `JWT_SECRET`: Your JWT secret key
- `SECRET_KEY`: Password hashing key
- `GOOGLE_CLIENT_ID`: From Google Cloud Console (optional)
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console (optional)

### 3. Set Up Database

For SQLite (development):
```bash
DATABASE_URL="sqlite+aiosqlite:///./eyewear.db"
```

For PostgreSQL (production):
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/eyewear_db"
```

### 4. Seed Database (Optional)

```bash
python seed_data.py
```

This creates:
- Admin user: `admin@eyewear.com` / `Admin@123`
- Sample categories (Sunglasses, Prescription, etc.)
- 6 sample products

### 5. Run Server

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 3000

# Or use the start script
./start.sh          # Linux/Mac
start.bat           # Windows
./start.bat --seed  # Windows with seeding
```

API will be available at: `http://localhost:3000`
API Docs at: `http://localhost:3000/docs`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Login with Google OAuth |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/trending` | Get trending products |
| GET | `/api/products/new-arrivals` | Get new arrivals |
| GET | `/api/products/search?q=query` | Search products |
| GET | `/api/products/{id}` | Get single product |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products/{id}/related` | Get related products |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/items` | Add item to cart |
| PATCH | `/api/cart/items/{id}` | Update cart item |
| DELETE | `/api/cart/items/{id}` | Remove from cart |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders` | Get order history |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/{id}/cancel` | Cancel order |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update profile |
| POST | `/api/user/change-password` | Change password |
| GET | `/api/user/wishlist` | Get wishlist |
| POST | `/api/user/wishlist/{id}` | Add to wishlist |
| DELETE | `/api/user/wishlist/{id}` | Remove from wishlist |

## Frontend Configuration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Database Schema

```
Users
  - id (PK)
  - email (unique)
  - name
  - phone
  - avatar
  - hashed_password
  - google_id (for OAuth)
  - is_active
  - is_verified

Products
  - id (PK)
  - name
  - slug (unique)
  - brand
  - category_id (FK)
  - price
  - original_price
  - stock_quantity
  - rating
  - is_active
  - is_featured

Orders
  - id (PK)
  - order_number (unique)
  - user_id (FK)
  - status
  - payment_status
  - total_amount
  - shipping_address (JSON)

Cart
  - id (PK)
  - user_id (FK)

CartItems
  - id (PK)
  - cart_id (FK)
  - product_id (FK)
  - quantity
  - variant (JSON)
```

## Production Deployment

### Using Gunicorn (Recommended)

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:3000
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]
```

### Environment Variables for Production

```env
APP_ENV=production
DEBUG=False
DATABASE_URL=postgresql://user:pass@db-host:5432/eyewear
JWT_SECRET=<strong-random-string>
SECRET_KEY=<strong-random-string>
GOOGLE_CLIENT_ID=<from-console>
GOOGLE_CLIENT_SECRET=<from-console>
CORS_ORIGINS=https://your-frontend-domain.com
```

## Testing

```bash
# Run health check
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eyewear.com","password":"Admin@123"}'
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

**Database connection error:**
- Check DATABASE_URL format
- Ensure database server is running
- Verify credentials

**CORS issues:**
- Check CORS_ORIGINS in .env
- Ensure frontend URL matches exactly (including port)
