const { neo4jgraphql } = require("neo4j-graphql-js");

export default {
  Query: {},

  Mutation: {
    CreateNote: async (obj, { input }, context) => {
      try {
        console.log("create note");
        console.log(input);
        let date = new Date();
        date = date.toString().substring(3, 15);
        const session = context.driver.session();
        const note = await session.run(
          "MATCH (u:User) WHERE u.email=$user CREATE (n: Note{noteId:$noteId,title:$title,text:$text,active:$active}) create (u)-[:WRITE{date:$date}]->(n) RETURN n",
          {
            noteId: input.noteId,
            title: input.title,
            text: input.text,
            user:input.user,
            active:true,
            date
          }
        );
        session.close();
        // console.log(note.records[0]._fields[0].properties);
        const data = note.records[0]._fields[0].properties;
        return data;
      } catch (error) {
        console.log(error);
        return new Error(error);
      }
    },

    EditNote:async (_,{input},context)=>{
        console.log("edit note");
        console.log(input);
        const session = context.driver.session();
        const note = await session.run(
            "MATCH(n:Note {noteId:$noteId}) SET n.title = $title, n.text= $text RETURN n",
            {
                noteId: input.noteId,
                title: input.title,
                text: input.text
            }
          );
        session.close();
        const data = note.records[0]._fields[0].properties;
        console.log(data); 
        return data;
    }
  },
};
