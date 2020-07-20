const { neo4jgraphql } = require("neo4j-graphql-js");
import token from '../Services/Token';

export default {
  Query: {},

  Mutation: {
    MakeGroup: async (_, { input }, context) => {
      try {
        console.log("make group");
        console.log(input);
        let date = new Date();
        date = date.toString().substring(3, 15);
        const user=await token.decode(context.req.headers.token,context.driver);
        const session = context.driver.session();
        const mutation = await session.run(
            "CREATE (g:Group {groupId: $groupId, createdBy:$userId name: $name, active:true, createdAt: $date}) RETURN g",{
                groupId: input.groupId,
                name:input.name,
                userId:user.userId,
                date
            }
        );
        session.close();
        const data = mutation.records[0]._fields[0].properties;
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    InviteUserstoGroup:async (_, {input}, context)=>{
        try {
          const {users, idGroup}=input;
          // const data=[];
          let date = new Date();
          date = date.toString().substring(3, 15)
          const user=await token.decode(context.req.headers.token,context.driver);
          console.log("user.userId",user.userId);          
          const res= await Promise.all(users.map(async (e)=>{
            const session = context.driver.session();
            // CREATE (from)-[:TAGGEDS{date:$date}]->(p) CREATE (p)-[:TAGGED_TO]->(to)
            const mutation= await session.run(
              "MATCH (from:User) WHERE from.userId=$fromUser MATCH(u:User) WHERE u.userId=$userId MATCH (g:Group) WHERE g.groupId=$groupId CREATE(from)-[:INVITE{date:$date}]->(g) CREATE (g)-[:INVITE_TO{status:$status,date:$date}]->(u) RETURN g",{
                userId:e,
                groupId: idGroup,
                status:"PENDING",
                fromUser:user.userId,
                date
              }
            )
            session.close();
            // data.push(mutation.records[0]._fields[0].properties)
          }))
          // console.log(data);
          return "Create success";
        } catch (error) {
          console.log(error);
          throw new Error(error)
        }
    },
    AceptInvitation:async(_,{input},context)=>{
      try {
        console.log("acept invitation");
        console.log(input);

        // SET r.nueva= $status2
        const session= context.driver.session();
        const mutation= await session.run(
          "MATCH (n)-[r:INVITE_TO]->(u) WHERE ID(r)=$id SET r.status=$status2 RETURN r",{
            id: input.id,
            status2: "ACEPT"
          }
        )
        console.log(mutation.records[0]._fields[0]);

        // console.log(mutation);
        session.close();
        return "fin Acept invitation"
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    ReportPost: async (_, {input}, context)=>{
      try {
        let report="violencia";
        const user=await token.decode(context.req.headers.token,context.driver);
        let date = new Date();
        date = date.toString().substring(3, 15);
        const session= context.driver.session();
        const mutation= await session.run(
          "MATCH (u:User) WHERE u.userId=$idUser MATCH (p:Publication) WHERE p.publicationId=$id CREATE(u)-[:REPORT{date:$date, reason:$reason}]->(p) RETURN p",{
            id: input.id,
            reason: report,
            idUser:user.userId,
            date
          }
        )
        session.close();
        return "Post Reported"
      } catch (error) {
        console.log(error);
        throw new Error(error)
      }
    },
    ReportComment:async (_,{input},context)=>{
      try {
        let report="violencia";
        const user=await token.decode(context.req.headers.token,context.driver);
        let date = new Date();
        date = date.toString().substring(3, 15);
        const session= context.driver.session();
        const mutation= await session.run(
          "MATCH (u:User) WHERE u.userId=$idUser MATCH (c:Comment) WHERE c.commentId=$id CREATE(u)-[r:REPORT{date:$date, reason:$reason}]->(c) RETURN r",{
            id: input.id,
            reason: report,
            idUser:user.userId,
            date
          }
        )
        session.close();
        return "comment Report!"
      } catch (error) {
        console.log(error);
        throw new Error(error)
      }
    }
  },
};
