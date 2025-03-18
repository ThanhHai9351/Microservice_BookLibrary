# Library Management Microservices

A modern microservices-based library management system with API Gateway using Nginx, JWT authentication, and Docker containerization.

## System Architecture

```
                           ┌─────────────┐
                           │             │
                           │  Nginx API  │
                           │   Gateway   │
                           │   (80)      │
                           │             │
                           └──────┬──────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
         ┌───────┴───────┐┌───────┴───────┐┌───────┴───────┐
         │               ││               ││               │
         │  Books API    ││ Customers API ││  Orders API   │
         │   (5001)      ││    (5002)     ││    (5003)     │
         │               ││               ││               │
         └───────────────┘└───────────────┘└───────────────┘
                 │                │                │
                 └────────────────┼────────────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                        │  Auth Service   │
                        │     (5004)      │
                        │                 │
                        └─────────────────┘
```

## Features

- **API Gateway (Nginx)**
  - Centralized routing
  - Rate limiting (10 requests/second)
  - CORS support
  - JWT validation
  - Error handling
  - Health check endpoint

- **Authentication Service**
  - JWT token generation
  - Token validation
  - Secure secret key management

- **Microservices**
  - Books Service
  - Customers Service
  - Orders Service

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd library-management
```

2. Start the services using Docker Compose:
```bash
docker-compose up --build
```

## Service Endpoints

### API Gateway (Port 80)

- Health Check: `GET /health`
- Books API: `GET /api/books/`
- Customers API: `GET /api/customers/`
- Orders API: `GET /api/orders/`

### Auth Service (Port 5004)

- Generate Token: `POST /token`
  ```json
  {
    "userId": "123",
    "role": "user"
  }
  ```
- Validate Token: `POST /validate`

## Authentication

All API endpoints (except `/health`) require JWT authentication. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/books
```

## Rate Limiting

- 10 requests per second per IP
- Burst capacity: 20 requests
- Error 429 returned when limit exceeded

## Error Handling

The API Gateway provides standardized error responses:

- 401: Unauthorized - Invalid or missing token
- 403: Forbidden - Access denied
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error

## Environment Variables

### Auth Service
```env
PORT=5004
JWT_SECRET=your_jwt_secret
```

### API Gateway
```env
PORT=80
BOOKS_SERVICE_URL=http://books:5001
CUSTOMERS_SERVICE_URL=http://customers:5002
ORDERS_SERVICE_URL=http://orders:5003
```

## Docker Services

- **nginx-gateway**: Nginx API Gateway
- **books**: Books Service
- **customers**: Customers Service
- **orders**: Orders Service
- **auth-service**: Authentication Service

## Network Configuration

All services communicate through the `library-network` Docker network.

## Scaling Services

To scale a service horizontally:

```bash
docker-compose up --scale books=3
```

## Development

1. Install dependencies for each service:
```bash
cd auth-service && npm install
```

2. Run services individually:
```bash
npm run dev
```

## Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Security headers (via Nginx)
- Isolated service networks

## Monitoring

- Service health check endpoint: `/health`
- Nginx access and error logs
- Service-specific logs available via Docker

## Troubleshooting

1. **Service Connection Issues**
   - Check if all containers are running: `docker-compose ps`
   - Verify network connectivity: `docker network inspect library-network`

2. **Authentication Issues**
   - Verify JWT_SECRET matches between services
   - Check token expiration
   - Ensure proper Authorization header format

3. **Rate Limiting Issues**
   - Check Nginx logs for rate limit errors
   - Adjust rate limit settings in nginx configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 