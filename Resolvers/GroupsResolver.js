const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    SearchLeader: async (obj, args, context, info) => {
      try {
        let resps = [];
          args.users.foreach(async (user) => {
            const session = context.driver.session();
            const resp = await session.run(
              'MATCH (u:User) WHERE u.userId=$id MATCH (u)-[:WORKS]->(d)<-[:WORKS{role:"Leader"}]-(l) return l',
              {
                id: user,
              }
            );
            session.close();
            if (resp.records.length > 0) {
              resps =  resp.records[0]._fields[0].properties;
            }
          }
        );
        console.log(resps);
        return resps;
      } catch (error) {}
    },
  },
  Mutation: {
    CreaGroupAndAddUsers: async (obj, args, context, info) => {
      try {
        const session = context.driver.session();

        const resp = await session.run(
          "MERGE (Grupo:Group{groupId:$groupid, name:$name,active:$active}) RETURN Grupo",
          {
            groupid: args.inputGroup.groupId,
            name: args.inputGroup.name,
            active: args.inputGroup.active,
          }
        );
        session.close();

        args.users.map(async (x) => {
          const session2 = context.driver.session();
          await session2.run(
            "MATCH(u:User) WHERE u.userId=$userId MATCH (g:Group) WHERE g.groupId=$groupid  MERGE (u)-[:BELONGS]->(g) RETURN g",
            {
              userId: x,
              groupid: args.inputGroup.groupId,
            }
          );
          session.close();
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};