**User Management**, **Document Management**, and **JWT-Role based Authentication**.

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

**Local Development Setup**
1. Clone the Repository
   git clone [https://github.com/Sudhakar-Mirjeli/NestJS-user-document-management.git]\
   cd project-name

2. Install Dependencies
   npm install

3. Create .env File
4. Run the App
5. Access the API

Visit: http://localhost:3000/api

Run the Test Cases:
Run Command: npm test


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

├── ingestion/          # Ingestion for docs.
│   ├── ingestion.controller.ts
│   └── ingestion.service.ts
|   |-─ ingestion.module.ts
│
│
├── app.module.ts
└── main.ts
|
test/
│
├── users/               # Test cases
│   ├── users.service.spec.ts
|   documents/               # Test cases
│   ├── documents.service.spec.ts
```
---

🚀 **Features**

## 🔐 Authentication (JWT)
- Users log in and receive a JWT token.
- The token must be attached in the `Authorization` header as `Bearer <token>` for protected routes.
- Uses a Passport strategy to validate JWT tokens.

---

## 👤 Auth Management
- `POST /auth/register`: Create new user.
- `POST /auth/login`: Login and receive JWT token.
- `POST /auth/logout`: Logout the currently logged-in user..

## 👤 User Management (only 'admin' role user can have access)
- `GET /users`: Get all users.
- `GET /users/:id`: Get specific user by id.
- `GET /users/find`: Get specific user by email id.
- `PUT /users/:id`: Update specific user.
- `DELETE /users/:id`: Delete a user.


## 📄 Document Management
- `POST /documents`: Add a document with a file. (The file will be stored in Amazon S3, and document url will be saved in PostgreSQL)
- `GET /documents`: Get all documents.
- `GET /documents/:id`: Get specific document.
- `PUT /documents/:id`: Update specific document by only ('admin', 'editor') roles.
- `DELETE /documents/:id`: Delete a document by only ('admin') role.

## 📄 Ingestion Management
- `POST /ingestion/trigger`: Triggers the ingestion process for a given document ID.
- `GET /ingestion/status/:id`: Retrieves the ingestion status for a specific ID.
- `GET /ingestion/history`: Fetches the ingestion history.

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
```# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
```

**docker-compose.yml**

```
version: '3.8'

services:
  nestjs:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nestjs-backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DB_HOST=postgres
      DB_PORT=5432
      DB_USERNAME=your_db_user
      DB_PASSWORD=your_db_password
      DB_NAME=your_db_name

  postgres:
    image: postgres:17
    container_name: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: your_db_user
      POSTGRES_PASSWORD: your_db_password
      POSTGRES_DB: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

```


## 🚀 CI/CD (GitHub Actions Sample)

**.github/workflows/deploy.yml**

```
name: Deploy NestJs to EC2

on:
  push:
    branches:
      - main  # Trigger deployment on push to the main branch

jobs:
  deploy:
    runs-on: ubuntu-latest  # Use the latest Ubuntu runner

    steps:
      - name: Checkout code
        uses: actions/checkout@v3  # Check out the repository code
      
      - name: Set up Docker
        uses: docker/setup-buildx-action@v2  # Set up Docker Buildx for building images

      - name: Build Docker image
        run: docker build -t nestjs-app .  # Build the Docker image with the tag 'nestjs-app'
      
      - name: Save image as tar file
        run: docker save nestjs-app > nestjs-app.tar  # Save the Docker image as a tar file

      - name: Copy image to EC2
        uses: appleboy/scp-action@v0.1.4  # Use SCP action to copy the tar file to the EC2 instance
        with:
          host: ${{secrets.EC2_HOST}}  # EC2 host address from secrets
          username: ubuntu  # EC2 username
          key: ${{secrets.EC2_SSH_KEY}}  # SSH private key from secrets
          source: 'nestjs-app.tar'  # Source file to copy
          target: "/home/ubuntu"  # Target directory on EC2
      
      - name: SSH into EC2 and run container
        uses: appleboy/ssh-action@v1.0.0  # Use SSH action to execute commands on the EC2 instance
        with:
          host: ${{ secrets.EC2_HOST }}  # EC2 host address from secrets
          username: ubuntu  # EC2 username
          key: ${{ secrets.EC2_SSH_KEY }}  # SSH private key from secrets
          script: |
            docker load < nestjs-app.tar  # Load the Docker image from the tar file
            docker stop nestjs-app || true && docker rm nestjs-app || true  # Stop and remove any existing container
            docker run -d -p 3000:3000 --name nestjs-app nestjs-app  # Run the container on port 3000

```

