const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
   
  },

  Mutation: {

   CommentPublication: async (obj, {input}, context, info)=>{
        try {

            const session = context.driver.session();
            let date = new Date();
            date=date.toString().substring(3,15);
            const response = await session.run(
                "MATCH(u:User) WHERE u.userId=$userId MATCH (p:Publication) WHERE p.publicationId=$publicationId CREATE (c:Comment{commentId:$commentId,text:$text}) CREATE (u)-[:WRITES{date:$date}]->(c)-[:COMMENTS]->(p) return c",{
                    userId: input.author,
                    publicationId: input.publicationId,
                    commentId: input.commentId,
                    text: input.text,
                    date
                }
            );
          return response.records[0]._fields[0].properties;
        } catch (error) {
            console.log(error);
        }
    },

    TaggInComment: async (obj, { input }, context, info)=>{

            try {
                let date = new Date();
            date=date.toString().substring(3,15);
                const session = context.driver.session();

                const response= await session.run(
                    "MATCH (from:User) where from.userId=$FromUserId MATCH (c:Comment) where c.CommentId=$CommentId Match (to:User) where to.userId=$ToUserId CREATE (from)-[:SHARES{date:$date}]->(p) CREATE (c)-[:SHARED_TO]->(to) RETURN from,to",
                    {
                        FromUserId: input.FromUserId,
                        CommentId:input.CommentId,
                        ToUserId: input.ToUserId,
                        date
                    }

                );

                console.log(`${input.FromUserId} Te etiqueto en una publicacion`);
                console.log(response);

                
                
            } catch (error) {
                console.log(error);
            }
    },

    




  },
};
