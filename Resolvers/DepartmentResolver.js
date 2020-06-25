const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    
  },

  Mutation: {

    createGroup: async (obj, args, context, info) => {
        try {
          const resp = await neo4jgraphql(obj, args, context, info);
          console.log(resp[1]);
  
          return resp;
        } catch (e) {
          console.log("Error");
        }
      },
  },
};