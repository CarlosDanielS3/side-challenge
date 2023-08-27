## ✨ Installation

Open a terminal and run the following commands:

```PowerShell
# clone this repository
git clone https://github.com/CarlosDanielS3/side-challenge

# Install the dependencies
yarn
```

```PowerShell
# Build the code
yarn build

# Start the application
yarn start
```

### The application is now running on port 3000 🚀

you can find an insomnia file in the root to import.
All the routes are documented in swagger, you can check the routes on **<http://localhost:3000/docs>**

## ✨  Code decisions

- Base repository: this strategy is about scalabilty, once we have the base repository we can just extends new repositories from it just infering the type of the entity. It can improve team time to implement new simples cruds, on complex queries we can just override the method that we want or if thats the case we also can improve the base repository to handle the context.
- Architecture: Some of clean arch with Domain Driven Design was implemented, each folder specify some rules to the files be in there;
 Application: The application layer is where the use cases of the system are implemented and where the business logic is executed. Also is responsible for taking input from the user or external systems, validating that input, and then using the domain layer to perform the necessary operations and translate the results of those operations into a format that can be understood by the user or external systems.
Domain: Responsible for representing the business concepts and rules that govern a particular problem domain. The domain layer is where the core business logic of the system is implemented. Also responsible for defining the entities, value objects, and aggregates that make up the domain model. It is also responsible for defining the business rules that govern the behavior of those entities and objects.
Infrastructure:  Is responsible for providing the technical details of the system, such as data storage, communication with external systems, and user interface. The infrastructure layer is where the implementation details of the system are located.

## ✨  Libraries

- Morgan: Provide logs information such as the HTTP method, URL, status code, response time, and more. It can be configured to log this information in a variety of formats, including Apache-style logs, JSON, and more.
- TSOA: TSOA is a library that helps you to create OpenAPI-compliant REST APIs using TypeScript and Node.js. It provides decorators that allow you to define your API endpoints and models using TypeScript classes and methods, and generates an OpenAPI specification and a set of routing controllers that handle incoming requests.

- Zod: is a TypeScript-first schema validation library that allows you to define and validate complex data structures with ease. It provides a simple and intuitive API for defining schemas, and supports a wide range of data types and validation rules.
- swagger-ui-express: Necessary to use TSOA to generate swagger

- The rest of the technologies i think you are familiar with like Express, Jest, Supertest, TypeOrm, Sequelize and others.
- I Made an ErrorHandler Middleware to track recognized error and also internal errors (500)

## ✨  Production like code improvements

- Add an apm to monitor the application
- Translate the logs to json
- Add dockerfile to handle the application for container services (EKS, ECS)
-
