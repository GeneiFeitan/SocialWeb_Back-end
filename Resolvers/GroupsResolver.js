const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    SearchLeader: async (obj, { users }, context, info) => {
      try {
        let resps = await Promise.all(
          users.map(async (user) => {
            const session = context.driver.session();
            const resp = await session.run(
              'MATCH (u:User) WHERE u.userId=$id MATCH (u)-[:WORKS]->(d)<-[:WORKS{role:"Leader"}]-(l) return l',
              {
                id: user,
              }
            );
            session.close();
            if (resp.records.length > 0) {
              return resp.records[0]._fields[0].properties;
            } else {
              return {
                name: "",
                password: "",
                userId: "",
                email: "",
                status: "",
                employeeNumber: "",
              };
            }
          })
        );
        // console.log(resps);

        let indx = resps.findIndex((elemen) => elemen.name === "");

        while (indx != -1) {
          resps.splice(indx, 1);
          indx = resps.findIndex((elemen) => elemen.name === "");
        }

        // console.log(resps);
        return resps;
      } catch (error) {}
    },
  },

  Mutation: {
    CreaGroupAndAddUsers: async (obj, args, context, info) => {
      try {
        
        const session = context.driver.session();
        console.log(JSON.stringify(args));

        const resp = await session.run(
          'MERGE (Grupo:Group{groupId:$groupid, name:$name,active:$active})RETURN Grupo',
          {
            groupid: args.inputGroup.groupId,
            name: args.inputGroup.name,
            active: args.inputGroup.active
          }
        );
        session.close();

       const resps= await Promise.all(args.users.map(async (x) => {
          const session2 = context.driver.session();
          const resp2= await session2.run(
            "MATCH(u:User) WHERE u.userId=$userId MATCH (g:Group) WHERE g.groupId=$groupid  MERGE (u)-[:BELONGS]->(g) RETURN g",
            {
              userId: x,
              groupid: args.inputGroup.groupId,
            }
          );
          session.close();
          if (resp.records.length > 0) {
            return resp2.records[0]._fields[0].properties;
          } 

        }));
        return resps[0];
      } catch (e) {
        console.log(e);
      }
    },

    makePublicationInGroup:async (obj, { input }, context)=>{
      try {
        console.log('aaa');
        let date = new Date();
        date= date.toString().substring(3,15);

        console.log(input);
        const session = context.driver.session();
        const resp = await session.run(
          "MATCH (u:User) WHERE u.userId=$userId MATCH (g:Group) WHERE g.groupId=$groupId CREATE (p:Publication {publicationId:$publicationId,text:$text,type:$type}) CREATE (u)-[:MAKES{date:$date}]->(p) CREATE (g)-[:HAS]->(p) return g",
          {
            userId: input.author,
            text: input.text,
            publicationId: input.publicationId,
            type: input.type,
            groupId: input.groupId,
            date
          }
        ) 
        session.close();

        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    }
  },


};
