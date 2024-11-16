# LoginPageV1

This is a test project, implementing authentication functionality against a mock REST API. 
The main purpose is to feature the usage of NgRx SignalStore.

Related Kanban board: [https://github.com/users/vmanchev/projects/3](https://github.com/users/vmanchev/projects/3)

## Development

1. Install the project and its dependencies:

```
npm install
```

2. Mockup server is enabled for development environment. Check the related code in 
`main.ts` file. All mockup server related files are located under `./src/mocks`.

3. Run the Angular project:

```
npm start
```

## Unit tests and code coverage

1. To run the unit tests use `npm t`
2. To generate the code coverage: run `npm run test:cc` and open `./coverage/login-page-v1/index.html` in your browser
