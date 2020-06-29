import { typeDefs} from './graphql-schema';
import {resolvers} from './Resolvers/resolvers';
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
    resolvers,
    context:({req})=>{
        // console.log(req.headers['authorization'])
        // console.log(req.headers);
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA );
                // console.log(usuario);
                return {
                    user
                }
            } catch (error) {
                console.log('Hubo un error');
                console.log(error);
            }
        }
    },
    config: {
        mutation: true,
        query: {
            exclude: ["CreateUser"]
        }
    }
});

const driver = neo4j.driver(
    process.env.NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(
        process.env.NEO4J_USER || "neo4j", 
        process.env.NEO4J_PASSWORD || "neo4j2"
    )
);


const server = new ApolloServer({
    schema,
    context: { driver}
    
});

// Specify host, port and path for GraphQL endpoint
const port = process.env.GRAPHQL_SERVER_PORT || 80
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
