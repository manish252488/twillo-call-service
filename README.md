# Backend API

Node.js backend with Express, TypeScript, Sequelize, and Twilio integration.

## Installation

```bash
npm i
```

## Environment Setup

Copy `.env.example` to `.env` and update with your values.

## Database Setup

```bash
npm run migrate
npm run seed
```

## Run

```bash
npm run dev
```

## Key Design Decisions

### Framework
I chose **Express.js with TypeScript** because:
- Express is lightweight and flexible, giving me full control over the architecture
- TypeScript provides type safety and better developer experience
- Easy to integrate with Sequelize ORM for database operations

### Database & ORM
**PostgreSQL with Sequelize-TypeScript** was selected because:
- Sequelize-TypeScript provides decorator-based models which are cleaner than raw SQL
- Migration system makes schema changes manageable

### Authentication Strategy
JWT-based authentication because:
- Token can include user information, reducing database queries

### Caching Layer
I implemented a simple in-memory cache service using Map because:
- Quick to implement and test

### API Structure
- router -> middlewares -> controller
- The main file handles the server start and assigns the cross origin and body parser plugins,
initializzed the db and starts the server
- The sequelize-cli init creates folder for migration, config and seeders and creates the configuration mapping so its easier to create the templated structer to create migration and seeders and execute them like if you want to create migration/seeder you can run the below commands
```
npx sequelize-cli migration:generate --name your-migration-name
npx sequelize-cli seed:generate --name your-seeder-name
```
### Error Handling
Centralized error handling through middleware:
- Consistent error response format
- Proper HTTP status codes
- Error messages that are user-friendly but informative

### Twilio Integration
Asynchronous call initiation:
- Calls are created in the database first
- Twilio API call happens in background
- Webhook handles status updates asynchronously
- Failed calls are marked appropriately

## What I Would Improve With More Time
- Unit tests for controllers, services, and utilities
- Integration tests for API endpoints
- Index on frequently queried fields (userId, status, createdAt)

- Replace in-memory cache with Redis for production

- Structured logging with Winston or Pino
- Rate limiting to prevent abuse
- CORS configuration refinement, like adding more allowed headers and allowed method.
- API versioning strategy like /v1/api or /v2/api helps in migrating old endpoints easily.

- Message queue (RabbitMQ/Kafka) for call processing
- Database migration strategy for zero-downtime mostly at build time can be handled by the yml configuration in github actions.
- ESLint and Prettier configuration
- Pre-commit hooks

## Contributor
Manish Singh
