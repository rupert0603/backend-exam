## Setup

Step 1: Run the following command in a terminal to setup the repository.

```
git clone https://github.com/rupert0603/backend-exam.git
cd ./backend-exam
npm i
```

Step 2: Change the database configuration in the `knexfile.js` file according to your MySQL database credentials.

Step 3: Create the databases in your MySQL server using the database names you used in the `knexfile.js` file. If you stayed with the default database names, run the following in your MySQL database:

```
CREATE DATABASE development_db;
CREATE DATABASE test_db;
```

The `development_db` will be used if the NodeJS server is run in development mode, while the `test_db` will be used by test files.

## Setting up the development database

Step 1: Run the migration file:
`npm run migrate`

Step 2: Run the seeder for admin user:
`npm run seed:admin`

After doing the steps, you can use the following admin credentials:

> username: jane*doe,
> password: 789_no_Virus*!

Optional Step: Run the seeder for dummy users;
`npm run seed -- --specific=test_users.js`

## Starting the development server

```
npm run dev
```

If there's an error, consider switching to NodeJS v16.15.1, as that's what I used to create the project.

## Running all tests

```
npm run test-all
```

## Running only a specific test

```
npm test -- file_name.test.js
```

## Endpoints

- **POST - Login** http://localhost:8000/auth/login
  Request Body:

```
{
   "username": "jane_doe",
   "password": "789_no_Virus_!"
}
```

- **POST - Add new user** - http://localhost:8000/users - **Admin only**

Request Header:

```
authorization: "Bearer admin_jwt_from_login"
```

Request Body:

```
{
    "first_name": "first0",
    "last_name": "last0",
    "address": "malabon",
    "post_code": "1000",
    "contact_phone_number": "09999999",
    "email": "jane_doe1@test.com",
    "username": "jane_doe1",
    "password": "mypassword",
    "role": "USER"
}
```

- **PATCH - Edit user** - http://localhost:8000/users/:id - **Admin only**

Request Header:

```
authorization: "Bearer admin_jwt_from_login"
```

Request Body:

```
{
    "first_name": "first0",
    "last_name": "last0",
    "address": "malabon",
    "post_code": "1000",
    "contact_phone_number": "09999999",
    "role": "USER"
}
```

The fields here are the only allowable properties to be edited. The properties can be sent in fragments.

- **GET - Fetch all users** - http://localhost:8000/users - **Admin only**

Request Header:

```
authorization: "Bearer admin_jwt_from_login"
```

- **DELETE - Delete one user** - http://localhost:8000/users/:id - **Admin only**

Request Header:

```
authorization: "Bearer admin_jwt_from_login"
```

- **DELETE - Delete many users** - http://localhost:8000/users - **Admin only**

Request Header:

```
authorization: "Bearer admin_jwt_from_login"
```

Request Body:

```
{
    "userIds": [5, 2]
}
```
