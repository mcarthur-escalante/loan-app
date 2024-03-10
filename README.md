# Loan Application Processing Service

This service demonstrates a simple microservice that manages loan applications, including submission, status checks, and admin
management.

## First Steps

### Set database password

**This step should be done only once.**

A `db_password.txt` file must be created in the root of
the project. The current development db password is `postgres`,
which is the value that the file should contain.
Just the password, without new lines.

### Start the dockerized application

To start the dockerized application, use the command:

```shell
docker compose up --build -d
```

### Check the generated API documentation

Go to <http://localhost:3000>. It may take a few seconds to load while the
[database schema](./database-schema.md) is created and initial data is seeded.
When the page loads, a Swagger documentation page will be shown,
which will also allow you to test the API.

### Check the application's [Entity-Relationship Diagram](./database-schema.md).

### Check the application's [Database Schema](./prisma/migrations/20240311223034_init/migration.sql)

### Stop the dockerized application

To stop the dockerized application, use the command:

```shell
docker compose down
```

## Development Workflow

### Set node version

The node version used is `v18.19.1`, which is specified in the `.nvmrc` file.
If you have `nvm` installed (Node Version Manager), you can use the following
command to set the node version:

```shell
nvm use
```

If not, you can [install it](https://github.com/nvm-sh/nvm). Otherwise, you
can install the required node version, or a version close to it.

### Install dependencies

```shell
npm install
```

### Configure environment variables

**This step should be done only once.**

A `.env` should be created at the root of the project
to specify the project's environment variables.
This file should not be version-controlled, since it
contains sensitive information. To prevent versioning,
it has already been added to the `.gitignore` file.

#### 1. Database Connection String

The development database has the following connection
attributes:

| Attribute | Value       |
| --------- | ----------- |
| Username  | `postgres`  |
| Password  | `postgres`  |
| Host      | `localhost` |
| Port      | `5432`      |
| Database  | `postgres`  |
| Schema    | `public`    |

These attributes should be provided as a connection string,
in a key called `DATABASE_URL` in the `.env` file, like so:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

#### 2. Application Port (optional)

By default, the application will start in port `3000`. If
you want to change the port, you can provide a value in
the `.env` value, using the `PORT` key, like so:

```dotenv
# You can use any port number
PORT=8080
```

### Start the development database

Before starting work on the project, you need to start the
development database using the command:

```shell
npm run db:start
```

This command will start a container running PostgreSQL 16.2
with a database configured as per the connection string
provided in the `DATABASE_URL` environment variable.

### Start the application

```shell
npm run dev
```

This command will start the application on `http://localhost:3000`,
or in the port specified in the `PORT` environment variable.
The development database must be started before running
this command.

The command will also create the application [database schema](./database-schema.md)
if necessary and seed it with the initial data for the `loan_types`
and `customers` tables.

### Test the Application

Go to <http://localhost:3000>. It may take a few seconds to load while the
database schema is created and initial data is seeded.
When the page loads, a Swagger documentation page will be shown,
which will also allow you to test the API.

### Stop the Application

If you need to stop the application, press Ctrl-C.

### Stop the development database

To stop the development database, run the following command:

```shell
npm run db:stop
```

### Adjust the schema if necessary

The project uses the [Prisma ORM](https://www.prisma.io/orm)
for persistence, which defines the [application schema](https://www.prisma.io/docs/orm/prisma-schema/overview#example) in the [schema.prisma](./prisma/schema.prisma) file.
If you make changes to this file, you need to reflect them in the schema by checking that the development database is running, and then using the command:

```shell
npx prisma migrate dev --name name-of-change
```

Where `name-of-change` is a short, descriptive name of
the change. This will modify the database schema according
to the prisma schema changes, and will also create a
migration SQL script with the name provided. These
migration scripts need to be source-controlled.
