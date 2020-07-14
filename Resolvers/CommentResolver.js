const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
    Query: {

    },

    Mutation: {

        CommentPublication: async(obj, { input }, context, info) => {
            try {

                const session = context.driver.session();
                let date = new Date();
                date = date.toString().substring(3, 15);
                const response = await session.run(
                    "MATCH(u:User) WHERE u.userId=$userId MATCH (p:Publication) WHERE p.publicationId=$publicationId CREATE (c:Comment{commentId:$commentId,text:$text}) CREATE (u)-[:WRITES{date:$date}]->(c)-[:COMMENTS]->(p) return c", {
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

        TaggInComment: async(obj, { input }, context, info) => {

            try {
                let date = new Date();
                date = date.toString().substring(3, 15);
                console.log(input);
                const session = context.driver.session();

                const response = await session.run(
                    "MATCH (from:User) where from.userId=$FromUserId MATCH (c:Comment) where c.commentId=$commentId Match (to:User) where to.userId=$ToUserId CREATE (from)-[:TAGGEDS{date:$date}]->(c) CREATE (c)-[:TAGGED_TO]->(to) RETURN from,to", {
                        FromUserId: input.FromUserId,
                        commentId: input.commentId,
                        ToUserId: input.ToUserId,
                        date
                    }

                );

                console.log(`${input.FromUserId} Te etiqueto en un un comentario`);
                console.log(response.records[0]._fields);



            } catch (error) {
                console.log(error);
            }
        },

        ReactToComment:async (_,{input},context)=>{
            try {
                const session = context.driver.session();
                let date= new Date();
                date= date.toString().substring(3,15);
                console.log(input);
                const mutation = await session.run(
                    "MATCH(from:User) where from.userId=$FromUserId MATCH(c:Comment) WHERE c.commentId= $commentId  CREATE (from)-[:REACTION_C{date:$date,type: $type,active:true}]->(c) RETURN from,c",
                    {
                        FromUserId:input.FromUserId,
                        commentId: input.commentId,
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