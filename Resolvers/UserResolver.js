const { neo4jgraphql } = require("neo4j-graphql-js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secret, expiresIn) => {
  const { userId, email, name } = usuario;
  return jwt.sign({ userId, email, name }, secret, { expiresIn });
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
      try {
        const usuarioId = await jwt.verify(token, process.env.SECRETWORD);
        console.log(JSON.stringify(usuarioId));
        return usuarioId;
      } catch (error) {
        console.log(error);
        throw new Error("No se pudo obtener el usuario");
      }
    },
  },

  Mutation: {
    NuevoUsuario: async (obj, { input }, context) => {
      try {
        const session = context.driver.session();
        // const salt = await bcryptjs.getSalt(10);
        input.password = await bcryptjs.hash(input.password, 10);
        const res = await session.run(
          "CREATE (n:User {userId:$userId, name:$name, lastName:$lastName,email:$email,password:$password,active:$active,exists:$exists,employeeNumber:$employeeNumber}) RETURN n",
          {
            userId: input.userId,
            name: input.name,
            lastName: input.lastName,
            email: input.email,
            password: input.password,
            active: input.active,
            exists: input.exists,
            employeeNumber: input.employeeNumber,
          }
        );
        session.close();
        return res;
      } catch (e) {
        throw new Error("No se pudo crear usuario!");
      }
    },
    authUser: async (_, { input }, context) => {
      try {
        const { email, password } = input;
        const session = context.driver.session();
        const res = await session.run("MATCH(n:User {email:$email}) RETURN n", {
          email: input.email,
        });
        session.close();
        if (!res.records.length) {
          throw new Error("El correo no existe!");
        }
        // validar contraseña
        const user = res.records[0]._fields[0].properties;
        const passwordCorret = await bcryptjs.compare(
          input.password,
          user.password
        );
        if (!passwordCorret) {
          throw new Error("el password no es correcto");
        }
        return {
          token: crearToken(user, process.env.SECRETWORD, "24h"),
        };
      } catch (error) {
        throw new Error("No se puedo autenticar");
      }
    },
    mergeUserToDepartmen: async (obj, args, context, info) => {
      try {
        const res = await neo4jgraphql(obj, args, context, info);
        return res;
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
