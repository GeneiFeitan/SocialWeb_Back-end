const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {
   
  },

  Mutation: {
    MakePublication: async (obj, { input}, context, info)=>{

        try {            
            const session = context.driver.session();
            let date = new Date();
            date=date.toString().substring(3,15);
            const response = await session.run(
                "MATCH (u:User) WHERE u.email=$email CREATE (p:Publication {publicationId:$id,text:$text}) CREATE (u)-[:WRITE{date:$date}]->(p) RETURN p",
                {
                    email: input.author,
                    text: input.text,
                    id:input.publicationId,
                    date
                }
            );
            session.close();
            console.log(response.records[0]._fields[0].properties);


            return response.records[0]._fields[0].properties;
        } catch (error) {
            console.log(error)
        }

    },

    CommentPublication: async (obj, {input}, context, info)=>{
        try {

            const session = context.driver.session();
            let date = new Date();
            date=date.toString().substring(3,15);
            const response = await session.run(
                "MATCH(u:User) WHERE u.email=$email MATCH (p:Publication) WHERE p.publicationId=$publicationId CREATE (c:Comment{commentId:$commentId,text:$text}) CREATE (u)-[:MAKES{date:$date}]->(c)-[:COMMENTS]->(p) return c",{
                    email: input.author,
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
    }
  },
};
