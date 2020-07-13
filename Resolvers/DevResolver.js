const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
    
  },

  Mutation: {
    ReactToPublication: async(_,{input}, context)=>{
        try {
            const session = context.driver.session();
            let date= new Date();
            date= date.toString().substring(3,15);
            console.log(input);
            const mutation = await session.run(
                "MATCH(from:User) where from.userId=$FromUserId MATCH(p:Publication) WHERE p.publicationId= $PublicationId  CREATE (from)-[:REACTIONS{date:$date, type:$type,active:true}]->(p) RETURN from,p",
                {
                    FromUserId:input.FromUserId,
                    PublicationId: input.PublicationId,
                    type: input.type,
                    date
                } 
            )
            session.close();
            console.log(JSON.stringify(mutation));
            const data=  mutation.records[0]._fields[0].properties;
            console.log(data);
            return "save";
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    },
    ReactToComment:async (_,{input},context)=>{
        try {
            const session = context.driver.session();
            let date= new Date();
            date= date.toString().substring(3,15);
            console.log(input);
            const mutation = await session.run(
                "MATCH(from:User) where from.userId=$FromUserId MATCH(c:Comment) WHERE c.commentId= $CommentId  CREATE (from)-[:REACTION_C{date:$date,type: $type,active:true}]->(c) RETURN from,c",
                {
                    FromUserId:input.FromUserId,
                    CommentId: input.CommentId,
                    type: input.type,
                    date
                } 
            )
            session.close();
            // const data = mutation.records[0]._fields[0].properties;
            // console.log(data);
            return "ok";
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
  },
};
