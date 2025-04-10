**User Management**, **Document Management**, and **JWT-based Authentication**.

---

## 📘 Project: User Document Management System (NestJS)

### 🧰 Tech Stack
- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Deployment:** Docker, AWS EC2
- **Storage:** AWS S3 for file uploads

---

## 📁 Project Structure
```
src/
│
├── auth/               # JWT Authentication
│   ├── auth.module.ts
|   ├── auth.controller.ts
|   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── roles.guard.ts
│
├── users/              # User Management
│   ├── user.entity.ts
│   ├── user.controller.ts
│   └── user.service.ts
|   |-─ user.module.ts
│
├── documents/          # Document Upload & Management
│   ├── document.entity.ts
│   ├── document.controller.ts
│   └── document.service.ts
|   |-─ document.module.ts
│
├── config/             # Configuration files
│   └── database.config.ts

├── ingestion/          # Ingestion  for docs.
│   ├── ingestion.controller.ts
│   └── ingestion.service.ts
|   |-─ ingestion.module.ts
│
│
├── app.module.ts
└── main.ts
```

---

## 🔐 Authentication (JWT)
- Users log in and receive a JWT token.
- The token must be attached in the `Authorization` header as `Bearer <token>` for protected routes.
- Uses a Passport strategy to validate JWT tokens.

---

## 👤 User Management
- `POST /auth/register`: Create new user
- `POST /auth/login`: Login and receive JWT token


**User Entity Sample**


## 📄 Document Management
- `POST /documents/upload`: Upload a document with a file (Protected)
- `GET /documents`: Get all documents (Protected)
- `GET /documents/:id`: Get specific document
- `DELETE /documents/:id`: Delete a document (Protected)

**Document Entity Sample**

---
## ⚙️ Environment Configuration (`.env`)
```env
PORT=3000
JWT_SECRET=your_secret_key
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket
```

---

## 🐳 Docker Deployment

**Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
```

**docker-compose.yml**


## 🚀 CI/CD (Optional GitHub Actions Sample)

**.github/workflows/deploy.yml**
```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Node
      uses: actions/setup-node@v2
      with:
        node-version: 18

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Docker build & push (example)
      run: |
        docker build -t your-image-name .
        docker tag your-image-name your-dockerhub-username/your-image-name
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push your-dockerhub-username/your-image-name
```

