# Library API Documentation

## Overview
API quản lý thư viện với các chức năng CRUD cho sách và quản lý người dùng.

## Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.library.com/api/v1`

## Authentication
API sử dụng JWT (JSON Web Tokens) để xác thực. Xem chi tiết tại [Authentication](./authentication.md)

## Rate Limiting
- 100 requests/minute cho authenticated users
- 20 requests/minute cho non-authenticated users

## Common Response Formats
### Success Response
```json
{
    "status": "success",
    "data": {
        // Response data here
    }
}
```

### Error Response
```json
{
    "status": "error",
    "error": {
        "code": "ERROR_CODE",
        "message": "Error message"
    }
}
```

## Common Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## API Endpoints
- [Books API](./endpoints/books.md)
- [Users API](./endpoints/users.md) 