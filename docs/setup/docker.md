# Docker Setup Guide

## Development Setup

1. Build and start containers:
```bash
docker-compose up -d
```

2. Stop containers:
```bash
docker-compose down
```

## Production Setup

1. Build production image:
```bash
docker build -t library-service:prod -f Dockerfile.prod .
```

2. Run production container:
```bash
docker run -d \
  --name library-service \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://mongo:27017/library \
  library-service:prod
```

## Docker Compose Configuration
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/library
      - REDIS_HOST=redis
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

## Health Check
```bash
curl http://localhost:3000/health
```

## Monitoring
- Container logs: `docker logs library-service`
- MongoDB container: `docker exec -it mongo mongo`
- Redis container: `docker exec -it redis redis-cli` 