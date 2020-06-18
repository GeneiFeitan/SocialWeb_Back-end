const { neo4jgraphql } = require('neo4j-graphql-js');

export const resolvers = {
    Query: {
      allUser: (obj, args, context, info) => {
        console.log(args);
          return neo4jgraphql(obj,args,context,info);
      },

      
    },

    Mutation: {
      mergeUserDepartmen2:(obj,args,context,info)=>{
        console.log(args);
        return neo4jgraphql(obj,args,context,info);
      },

      CreateUserandAddtoDepartmen:(obj,args,context,info)=>{
        console.log(info);
        return neo4jgraphql(obj,args,context,info);
      }
      
    }
  };