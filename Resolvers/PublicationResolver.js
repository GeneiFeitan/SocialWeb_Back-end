const { neo4jgraphql } = require("neo4j-graphql-js");
import token from '../Services/Token';

export default {
    Query: {

    },

    Mutation: {

        MakePublication: async(obj, { input }, context, info) => {

            try {
                const session = context.driver.session();
                let date = new Date();
                date = date.toString().substring(3, 15);
                const response = await session.run(
                    "MATCH (u:User) WHERE u.userId=$userId CREATE (p:Publication {publicationId:$id,text:$text,type:$type}) CREATE (u)-[:MAKES{date:$date}]->(p) RETURN p", {
                        userId: input.author,
                        text: input.text,
                        id: input.publicationId,
                        type: input.type,
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


        SharePublication: async(obj, { input }, context, info) => {
            try {
                let date = new Date();
                date = date.toString().substring(3, 15);
                const session = context.driver.session();

                const response = await session.run(
                    "MATCH (from:User) where from.userId=$FromUserId MATCH (p:Publication) where p.publicationId=$publicationId Match (to:User) where to.userId=$ToUserId CREATE (from)-[:SHARES{date:$date}]->(p) CREATE (p)-[:SHARED_TO]->(to) RETURN from,to", {
                        FromUserId: input.FromUserId,
                        publicationId: input.publicationId,
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


        TaggInPublication: async(obj, { input }, context, info) => {
            try {
                let date = new Date();
                date = date.toString().substring(3, 15);
                const session = context.driver.session();

                const response = await session.run(
                    "MATCH (from:User) where from.userId=$FromUserId MATCH (p:Publication) where p.publicationId=$publicationId Match (to:User) where to.userId=$ToUserId CREATE (from)-[:TAGGEDS{date:$date}]->(p) CREATE (p)-[:TAGGED_TO]->(to) RETURN from,to", {
                        FromUserId: input.FromUserId,
                        publicationId: input.publicationId,
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

        ReactToPublication: async(_,{input}, context)=>{
            try {
                const session = context.driver.session();
                const user=await token.decode(context.req.headers.token,context.driver);
                console.log(user);
                let date= new Date();
                date= date.toString().substring(3,15);
                console.log(input);
                const mutation = await session.run(
                    "MATCH(from:User) where from.userId=$FromUserId MATCH(p:Publication) WHERE p.publicationId= $publicationId  CREATE (from)-[:REACTIONS{date:$date, type:$type,active:true}]->(p) RETURN from,p",
                    {
                        FromUserId:user.userId,
                        publicationId: input.publicationId,
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






    },
};