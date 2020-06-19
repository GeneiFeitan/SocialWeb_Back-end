const { neo4jgraphql } = require("neo4j-graphql-js");
const jwt = require('jsonwebtoken');

const crearToken=(usuario, secreta, expiresIn)=>{
  const {id, email, password} = usuario;
  return jwt.sign( { id } ,secreta, {expiresIn})
}


export default {
  Query: {
    allUser: async (obj, args, context, info) => {
      try {
        const resp = await neo4jgraphql(obj, args, context, info);
        return resp;
      } catch (e) {
        console.log("Error");
      }
    },
    obtenerUsuario:async (_,{token})=>{
      const usuarioId = jwt.verify(token,"secretWord")
      return usuarioId
    }
  },

  Mutation: {
    autenticarUsuario: async (_,{input})=>{
      const {email, password}=input;
      const existeUsuario=input;
      //si el usuario existe
      
      //revisar password

      //crear token
      return {
        token: crearToken(existeUsuario,"secretWord",'24h')
      }

    },
    mergeUserToDepartmen: async (obj, args, context, info) => {
      try {
        const resp = await neo4jgraphql(obj, args, context, info);
        return resp;
      } catch (error) {
        console.log("Error");
      }
    },

    CreateUserandAddtoDepartmen: async (obj, args, context, info) => {
      try {
        console.log(info);
        const resp = await neo4jgraphql(obj, args, context, info);

        return resp;
      } catch (error) {
        console.log("Error");
      }
    },
  },
};
