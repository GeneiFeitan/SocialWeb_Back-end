const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    
  },

  Mutation: {

    createGroupAndAddUsers: async (obj, args, context, info) => {
        try {
          const resp = await neo4jgraphql(obj, args, context, info);
          console.log(context.driver.User);

            
          return args.users
        } catch (e) {
          console.log(e);
        }
      },
  },
};
