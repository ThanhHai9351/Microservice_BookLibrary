# Books API

## Get Books
Get list of books with pagination.

### Request
```http
GET /api/v1/books?page=1&limit=10
```

### Query Parameters
| Parameter | Type    | Default | Description           |
|-----------|---------|---------|----------------------|
| page      | number  | 1       | Page number          |
| limit     | number  | 10      | Items per page       |
| search    | string  | -       | Search by title      |
| category  | string  | -       | Filter by category   |

### Response
```json
{
    "status": "success",
    "data": {
        "books": [{
            "id": "string",
            "title": "string",
            "author": "string",
            "isbn": "string",
            "category": "string",
            "quantity": "number",
            "createdAt": "date",
            "updatedAt": "date"
        }],
        "pagination": {
            "page": 1,
            "limit": 10,
            "totalPages": 5,
            "totalItems": 48
        }
    }
}
```

## Create Book
Create a new book.

### Request
```http
POST /api/v1/books
```

### Headers 