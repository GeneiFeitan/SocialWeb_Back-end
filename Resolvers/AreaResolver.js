const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    
  },

  Mutation: {

    CreateAreaAndAddUsers: async(obj, { areaInput,users,departmentId}, context, info)=>{

        try {
            const session = context.driver.session();
            
            const resp = await session.run(
              'MATCH (d:Department) WHERE d.departmentId=$departmentId MERGE (a:Area{areaId:$areaid, name:$name,active:$active}) MERGE (a)-[:IN_DEPARTMENT]->(d) RETURN a',
              {
                areaid:areaInput.areaId,
                name:areaInput.name,
                active:areaInput.active,
                departmentId: departmentId
              }
            );
            session.close();
    
           const resps= await Promise.all(users.map(async (x) => {
              const session2 = context.driver.session();
              const resp2= await session2.run(
                "MATCH(u:User) WHERE u.userId=$userId MATCH (a:Area) WHERE a.areaId=$areaId  MERGE (u)-[:WORKS]->(a) RETURN a",
                {
                  userId: x,
                  areaId: areaInput.areaId,
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
   }
  },
};