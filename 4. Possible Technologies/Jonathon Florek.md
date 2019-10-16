# Frameworks I know or have heard of

see [realworld.io](https://realworld.io) for basic architecture examples of various frameworks

## General

- [openapi3](https://swagger.io/docs/specification/about/)
  - write an api specification, then implement frontend and backend separately
  - backend can be tested without a frontend using the [openapi editor](https://editor.swagger.io/)

## Frontend

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/) (I consider the redux part to be the 'backend of the frontend')
  - a few ways to integrate loading data from the backend into the redux store
  - can use [Redux Thunk](https://github.com/reduxjs/redux-thunk) (one of the standard ways of doing it)
  - can also make custom middleware that accesses backend whenever a 'load x' action is dispatched
- haven't used any of these, but there are a lot of data [visualization packages](https://www.npmjs.com/search?q=data%20visualization) on npm

## Backend

- NodeJS & Express & TypeScript (did 2 work terms with this)
- dotnet core (did 1 work term + lots of part time work with this)
- [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
  - also see onion architecture
  - domain model is core model of system (operations done on this & invalid instances can't be constructed without throwing an exception); this component doesn't reference any outer parts of the system
  - data transfer objects (DTOs) are http-friendly model of system (just use strings, numbers, booleans, dumb data objects, arrays)
  - data persistence objects (DPOs; warning: not a standard industry term) are database-friendly model of system (if Entity Framework used then objects having EF's attributes)
  - DTOs and DPOs have mapping methods to & from domain model as needed (or if dotnet an automapper library can be used to do this for us, but then we're relying on automapper conventions)
- db layer: Entity Framework (dotnet), TypeORM (Node)
- haven't done anything in java, but it's usually the same as dotnet
- other possible db layers I don't have experience in: Dapper (dotnet)
- can also do Razor pages to define html templates in dotnet core (sort of like php generating html); this eliminates need for web api entirely but makes using javascript frameworks on client side more challenging
- I haven't done domain driven design but it would be good experience to do it (Tim also mentioned it, maybe he has resources)
- testing dotnet: xunit
- testing nodejs: jest

## Other Opinions

- pls let me do backend
- existing excel sheets suggest storing everything in relational database (mssql, mysql, postgres, ...) preferable to document databases
- identity of users should not be defined in a local database; assume external identity provider (if we define identities locally then we also need a db mapping remote identity provider ids to our own identities)
- use an oauth2 identity provider instead of doing our own (more secure)
- for security, current user ID + their list of permissions available somehow in each request
- we can probably assume this won't be a multitenant application

## Regarding a wiki or forum

- [Wiki.js](https://wiki.js.org/) is open source wiki software with authentication modules that can integrate with a number of oauth2 providers including azure ad, auth0, etc (no research done on how well user permissions can be defined with this). **This software has SAML enterprise security integration.**
- there's probably forum software somewhere


TODO: delete this TODO or add more content
