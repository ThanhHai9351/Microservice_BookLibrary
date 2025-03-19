# Library Management Microservices

A modern microservices-based library management system with API Gateway using Nginx, JWT authentication, RabbitMQ message queue, and Docker containerization.

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
         │   (3001)      ││    (3002)     ││    (3003)     │
         │               ││               ││               │
         └───────┬───────┘└───────┬───────┘└───────┬───────┘
                 │                │                │
                 └────────────────┼────────────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                        │  Auth Service   │
                        │     (3004)      │
                        │                 │
                        └────────┬────────┘
                                │
                        ┌───────┴────────┐
                        │               │
                        │   RabbitMQ    │
                        │  (5672/15672) │
                        │               │
                        └───────────────┘
```

## Features

- **API Gateway (Nginx)**
  - Centralized routing
  - Rate limiting (10 requests/second)
  - CORS support
  - JWT validation
  - Error handling
  - Health check endpoint

- **Message Queue (RabbitMQ)**
  - Asynchronous communication between services
  - Message persistence
  - Dead letter queues
  - Message retry mechanism
  - Management UI (port 15672)

- **Authentication Service**
  - JWT token generation
  - Token validation
  - Secure secret key management

- **Microservices**
  - Books Service
  - Customers Service
  - Orders Service

## Message Queue Patterns

The system implements several message queue patterns:

1. **Direct Exchange**
   - Order processing
   - Book inventory updates
   - Customer notifications

2. **Topic Exchange**
   - Event logging
   - Monitoring
   - Analytics

3. **Dead Letter Exchange**
   - Failed message handling
   - Retry mechanism
   - Error logging

## Queue Structure

```
exchanges/
├── library.direct
│   ├── orders.processing
│   ├── books.inventory
│   └── customers.notifications
├── library.topic
│   ├── logs.#
│   ├── monitoring.#
│   └── analytics.#
└── library.dlx
    └── dead.letter.queue
```

## RabbitMQ Management

Access the RabbitMQ Management UI:
- URL: http://localhost:15672
- Username: admin
- Password: admin123

## Message Queue Examples

1. Publishing a message:
```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.publishToExchange('library.direct', 'orders.processing', {
    orderId: '123',
    status: 'pending'
});
```

2. Consuming messages:
```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.consume('orders.processing', async (message) => {
    console.log('Processing order:', message);
    // Process the order
});
```

## Environment Variables

### RabbitMQ
```env
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672
RABBITMQ_MANAGEMENT_PORT=15672
```

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
- **RabbitMQ monitoring**:
  - Message rates
  - Queue lengths
  - Connection status
  - Error rates

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

4. **RabbitMQ Issues**
   - Check RabbitMQ Management UI for queue status
   - Verify connection strings
   - Check for queue bindings
   - Monitor dead letter queues
   - Review message TTL settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 

## Additional Information

### Publishing Logs

Bất kỳ service nào có thể publish logs đến RabbitMQ:

```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.publishToExchange('library.topic', 'logs.error', {
    service: 'books',
    error: 'Database connection failed',
    timestamp: new Date()
});
```

### Logging Service

Logging Service có thể consume logs từ RabbitMQ:

```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.consume('logs.error', async (log) => {
    // Lưu log vào database
    await saveLog(log);
});
```

## Orders Service

```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.publishToExchange('library.direct', 'orders.processing', {
    orderId: '123',
    books: ['book1', 'book2'],
    customerId: 'cust123'
});
```

## Books Service

```javascript
const mq = require('../shared/messageQueue');

await mq.connect();
await mq.consume('orders.processing', async (order) => {
    // Kiểm tra và cập nhật tồn kho
    await updateInventory(order.books);
});
``` 