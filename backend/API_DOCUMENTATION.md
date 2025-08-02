# API Documentation

Base URL: `http://localhost:4000`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication APIs

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "string",
    "role": "user"
  }
}
```

**Error Responses:**
- **400**: Missing fields or username already exists
```json
{
  "error": "Please fill in all fields"
}
```
```json
{
  "error": "Username already exists"
}
```

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "role": "user"
  }
}
```

**Error Responses:**
- **401**: Invalid credentials
```json
{
  "error": "Invalid login credentials"
}
```

---

## File APIs

### 1. Upload File
**POST** `/upload`
🔒 **Authentication Required**

**Request Body:** `multipart/form-data`
- `file`: File (binary)
- `isPrivate`: boolean (optional)

**Response (200):**
```json
{
  "fileId": 1,
  "name": "filename.ext",
  "cids": [
    "QmHash1...",
    "QmHash2...",
    "QmHash3..."
  ],
  "isPrivate": false
}
```

**Error Responses:**
- **400**: No file provided
```json
{
  "error": "No file was sent."
}
```
- **401**: Invalid token
```json
{
  "error": "Token not provided"
}
```

### 2. Get Files from Smart Contract
**GET** `/files`

**Response (200):**
```json
[
  {
    "name": "filename.ext",
    "cids": [
      "QmHash1...",
      "QmHash2...",
      "QmHash3..."
    ],
    "owner": "0xAddress...",
    "timestamp": 1234567890
  }
]
```

**Error Responses:**
- **500**: Server error
```json
{
  "error": "An error occurred while fetching files"
}
```

### 3. Get All Files from Database
**GET** `/`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "filename.ext",
    "cids": [
      "QmHash1...",
      "QmHash2...",
      "QmHash3..."
    ],
    "owner": "username",
    "is_private": false,
    "timestamp": 1234567890
  }
]
```

**Error Responses:**
- **500**: Server error
```json
{
  "message": "Failed to fetch files"
}
```

### 4. Update File Visibility
**PUT** `/files/{id}/visibility`
🔒 **Authentication Required** (Owner only)

**Path Parameters:**
- `id`: integer (File ID)

**Request Body:**
```json
{
  "isPrivate": true
}
```

**Response (200):**
```json
{
  "message": "Visibility updated",
  "file": {
    "id": 1,
    "filename": "filename.ext",
    "cid1": "QmHash1...",
    "cid2": "QmHash2...",
    "cid3": "QmHash3...",
    "owner_id": 1,
    "is_private": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **403**: Not authorized (only owner can modify)
```json
{
  "message": "Not authorized"
}
```
- **404**: File not found
```json
{
  "message": "File not found"
}
```

### 5. Delete File
**DELETE** `/files/{id}`
🔒 **Authentication Required** (Owner or Admin only)

**Path Parameters:**
- `id`: integer (File ID)

**Response (200):**
```json
{
  "message": "File deleted successfully."
}
```

**Error Responses:**
- **403**: Not authorized
```json
{
  "message": "You are not allowed to delete this file."
}
```
- **404**: File not found
```json
{
  "message": "File not found"
}
```

---

## User APIs

### 1. Get Current User Profile
**GET** `/me`
🔒 **Authentication Required**

**Response (200):**
```json
{
  "id": 1,
  "username": "string",
  "role": "user"
}
```

**Error Responses:**
- **404**: User not found
```json
{
  "message": "User not found"
}
```
- **401**: Invalid token
```json
{
  "error": "Token not provided"
}
```

---

## Common Error Responses

### Authentication Errors
- **401 Unauthorized**: Token not provided or invalid
```json
{
  "error": "Token not provided"
}
```
```json
{
  "error": "Invalid token"
}
```

### Server Errors
- **500 Internal Server Error**: General server error
```json
{
  "error": "Server error message"
}
```
```json
{
  "message": "Server error message"
}
```

---

## Data Models

### User
```json
{
  "id": "integer",
  "username": "string",
  "role": "string (user|admin)"
}
```

### File
```json
{
  "id": "integer",
  "name": "string",
  "cids": ["string", "string", "string"],
  "owner": "string",
  "is_private": "boolean",
  "timestamp": "integer"
}
```

### File (Database Model)
```json
{
  "id": "integer",
  "filename": "string",
  "cid1": "string",
  "cid2": "string", 
  "cid3": "string",
  "owner_id": "integer",
  "is_private": "boolean",
  "created_at": "string (ISO date)",
  "updated_at": "string (ISO date)"
}
```

---

## Notes

1. **File Upload**: Files are automatically split into 3 parts and stored on different IPFS nodes
2. **Authentication**: JWT tokens expire in 3 hours
3. **File Privacy**: Private files can only be accessed by their owners
4. **File Deletion**: Only file owners or admins can delete files
5. **CORS**: Configured for `http://localhost:3000` origin
6. **API Documentation**: Interactive Swagger UI available at `/api-docs` 