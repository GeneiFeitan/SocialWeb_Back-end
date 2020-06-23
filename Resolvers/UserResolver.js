const { neo4jgraphql } = require("neo4j-graphql-js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crearToken = (usuario, secreta, expiresIn) => {
  const { id, email, password } = usuario;
  return jwt.sign({ id }, secreta, { expiresIn });
};

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
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = jwt.verify(token, "secretWord");
      return usuarioId;
    },
  },

  Mutation: {
    NuevoUsuario: async (obj, { input }, context) => {
      try {
        console.log("Aca");

        const session = context.driver.session();
        //console.log(session)
        console.log(input);
        const salt = await bcryptjs.getSalt(10);
        input.password = await bcryptjs.hash(input.password, salt);
        console.log(input.password);
        return session
          .run(
            "CREATE (n:User {name:$name, lastName:$lastName,email:$email,password:$password,active:$active,exists:$exists,employeeNumber:$employeeNumber}) RETURN n",
            {
              name: input.name,
              lastName: input.lastName,
              email: input.email,
              password: input.password,
              active: input.active,
              exists: input.exists,
              employeeNumber: input.employeeNumber,
            }
          )
          .then((re) => {
            session.close();
            return input;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    },
    autenticarUsuario: async (_, { input }, context) => {
      console.log("aca");
      try {
        console.log("aca");
        console.log(input);
        const { email, password } = input;
        const session = context.driver.session();
        const r=session
          .run(
            "MATCH(n:User {email:$email}) RETURN n",
            {
              email: input.email,
            }
          )
          .then((re) => {
            console.log("re"+JSON.stringify(re.records));
            if (re.records.length) {
              console.log("existe un usuario");
              
            } else {
              console.log("no existe");
            }
          }).catch((err)=>{
            console.log("catch error: "+err);
          })
      } catch (error) {
        console.log(error);
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
