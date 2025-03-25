# URL Shortener API - Project Diagram

This document provides visual representations of the URL Shortener API architecture and workflows.

## System Architecture

```mermaid
graph TD
    Client[Client/Frontend] -->|HTTP Requests| API[Express API Server]
    API -->|Authentication Check| Auth[Auth Service]
    Auth -->|If Authenticated| URLService[URL Shortener Service]
    Auth -->|Verify| JWT[JWT Validation]
    Auth -->|Store/Retrieve| UserDB[(User Database)]
    URLService -->|Store/Retrieve| UrlDB[(URL Database)]
    URLService -->|Record Analytics| Analytics[Analytics Service]
    Analytics -->|Store/Retrieve| AnalyticsDB[(Analytics Database)]
    
    subgraph "Backend Services"
        Auth
        URLService
        JWT
        Analytics
    end
    
    subgraph "Data Storage"
        UserDB
        UrlDB
        AnalyticsDB
    end
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant Auth as Auth Middleware
    participant Route as Protected Route
    
    Client->>API: Request with JWT token
    API->>Auth: Pass request
    Note right of Auth: Extract token from Authorization header
    
    alt No token
        Auth-->>Client: 401 - Authorization header missing
    else Token extraction failed
        Auth-->>Client: 401 - Token missing
    else Token verification failed
        Auth-->>Client: 401 - Invalid token
    else Token valid
        Auth->>Auth: Decode JWT payload
        Auth->>Auth: Attach user to request
        Auth->>Route: Pass to route handler
        Route-->>Client: Protected resource/operation
    end
```

## URL Shortening Process

```mermaid
flowchart TD
    A[Client] -->|Submit URL| B[API Endpoint]
    B -->|Validate Request| C{Authenticated?}
    C -->|No| D[Return 401]
    C -->|Yes| E[Generate Short Code]
    E --> F[Store URL Mapping]
    F --> G[Return Short URL]
    
    H[Client] -->|Access Short URL| I[Redirect Endpoint]
    I -->|Lookup Original URL| J[URL Database]
    J -->|URL Found| K[Redirect to Original URL]
    J -->|URL Not Found| L[Return 404]
```

## Component Structure

```mermaid
classDiagram
    class Server {
        +Express app
        +start()
        +setupMiddleware()
        +setupRoutes()
    }
    
    class AuthMiddleware {
        +validate(req, res, next)
    }
    
    class UrlController {
        +createShortUrl()
        +redirectToOriginal()
        +getUserUrls()
        +deleteUrl()
    }
    
    class UrlService {
        +generateShortCode()
        +createMapping()
        +findOriginalUrl()
        +listUserUrls()
    }
    
    class AuthController {
        +register()
        +login()
        +refreshToken()
    }
    
    Server --> AuthMiddleware
    Server --> UrlController
    Server --> AuthController
    UrlController --> UrlService
    AuthController --> AuthMiddleware
```

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ URLS : creates
    URLS ||--o{ ANALYTICS : generates
    
    USERS {
        string id PK
        string email
        string password
        string name
        date createdAt
        date updatedAt
    }
    
    URLS {
        string id PK
        string shortCode UK
        string originalUrl
        string userId FK
        date createdAt
        date updatedAt
        int clickCount
    }

    ANALYTICS {
        string id PK
        string urlId FK
        datetime accessTime
        string ipAddress
        string userAgent
        string referrer
        string country
        string city
        string deviceType
        string browserType
        string osType
    }
``` 