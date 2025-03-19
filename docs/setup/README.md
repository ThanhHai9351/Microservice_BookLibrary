# Setup Guide

## Prerequisites
- Node.js (v14 or later)
- MongoDB (v4.4 or later)
- Redis (v6 or later)
- Docker & Docker Compose (optional)

## Quick Start
1. Clone repository
```bash
git clone https://github.com/your-username/library-service.git
cd library-service
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env file with your configurations
```

4. Start development server
```bash
npm run dev
```

## Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/library
MONGODB_TEST_URI=mongodb://localhost:27017/library_test

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

## Available Scripts
- `npm run dev`: Start development server
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run build`: Build for production

## Docker Setup
See [Docker Setup Guide](./docker.md) for containerized deployment.

## Database Migrations
```bash
# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback
```

## Logging
Logs are stored in `logs/` directory:
- `logs/error/`: Error logs
- `logs/combined/`: All logs

## Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep="Book API"

# Run with coverage
npm run test:coverage
``` 