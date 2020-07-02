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
<<<<<<< HEAD
    // context:({req})=>{
    //     // console.log(req.headers['authorization'])
    //     // console.log(req.headers);
    //     const token = req.headers['authorization'] || '';
    //     if(token) {
    //         try {
    //             const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA );
    //             console.log(usuario);
    //             return {
    //                 user
    //             }
    //         } catch (error) {
    //             console.log('Hubo un error');
    //             console.log(error);
    //         }
    //     }
    //     else{
    //         console.log('aaa');
    //     }
    // },
=======
    context: async({req})=>{
        // console.log(req.headers['authorization'])
        // console.log(req.headers);
        const token = req.headers['authorization'] || '';
        if(token !=="null") {
            try {
                const user = await jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA );
                console.log(usuario);
                return {
                    user
                }
            } catch (error) {
                console.log('Hubo un error');
                // console.log(error);
            }
        }
        else{
            console.log('error');
        }
    },
>>>>>>> 3b2f80b31be10a3570e1a438b34ce7e973533b5f
    config: {
        mutation: true,
        query: {
            exclude: ["CreateUser"]
        }
    }
});

const driver = neo4j.driver(
    process.env.NEO4J_URI || "bolt://localhost:11005",
    neo4j.auth.basic(
        process.env.NEO4J_USER || "neo4j", 
        process.env.NEO4J_PASSWORD || "123456"
    )
);


const server = new ApolloServer({
    schema,
<<<<<<< HEAD
    context:({ req }) =>{
        return {
                    driver,
                    req
            };
    }
    
=======
    context: { driver}    
>>>>>>> 3b2f80b31be10a3570e1a438b34ce7e973533b5f
});

// Specify host, port and path for GraphQL endpoint
const port = process.env.GRAPHQL_SERVER_PORT || 80
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql'
const host = process.env.GRAPHQL_SERVER_HOST || '10.89.52.46'

/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */

server.applyMiddleware({ app, path })

app.listen({ host, port, path }, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`)
})
