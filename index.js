import { typeDefs} from './graphql-schema';
import { initializeDatabase } from "./initialize"
import { ApolloServer } from 'apollo-server-express'
import express from 'express';
import dotenv from 'dotenv'


const neo4j = require('neo4j-driver');
const { makeAugmentedSchema } = require('neo4j-graphql-js');


//set environment variables from .env
dotenv.config();

const app = express();

const schema = makeAugmentedSchema({
    typeDefs,
    config: {
        mutation: false,
        query: {
            exclude: ["MySecretType"]
        }
    }
});

const driver = neo4j.driver(
    process.env.NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(
        process.env.NEO4J_USER || "neo4j", 
        process.env.NEO4J_PASSWORD || "12345"
    )
    // ,{
    //     encrypted: process.env.NEO4J_ENCRYPTED ? 'ENCRYPTION_ON': 'ENCRYPTION_OFF',
    // }
);

/*
 * Perform any database initialization steps such as
 * creating constraints or ensuring indexes are online
 *
 */
// const init = async (driver) => {
//     await initializeDatabase(driver)
// }

/*
 * We catch any errors that occur during initialization
 * to handle cases where we still want the API to start
 * regardless, such as running with a read only user.
 * In this case, ensure that any desired initialization steps
 * have occurred
 */

// init(driver)

/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */
// const server = new ApolloServer({
//     context: { driver, neo4jDatabase: process.env.NEO4J_DATABASE||Graph },
//     schema: schema,
//     introspection: true,
//     playground: true,
// });

const server = new ApolloServer({
    schema,
    context: { driver }
});

// Specify host, port and path for GraphQL endpoint
const port = process.env.GRAPHQL_SERVER_PORT || 4001
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql'
const host = process.env.GRAPHQL_SERVER_HOST || 'localhost'

/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */

server.applyMiddleware({ app, path })

app.listen({ host, port, path }, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`)
})
