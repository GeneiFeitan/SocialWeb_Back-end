const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    allUser: async (obj, args, context, info) => {
      try {
        const resp = await neo4jgraphql(obj, args, context, info);
        return resp;
      } catch (e) {
        console.log("Error");
      }
    },
  },

  Mutation: {
    mergeUserToDepartmen: async (obj, args, context, info) => {
      try {
        const resp = await neo4jgraphql(obj, args, context, info);
        return resp;
      } catch (error) {
        console.log("Error");
      }
    },

    CreateUserandAddtoDepartmen: async (obj, args, context, info) => {
      try {
        console.log(info);
        const resp = await neo4jgraphql(obj, args, context, info);

        return resp;
      } catch (error) {
        console.log("Error");
      }
    },
  },
};
