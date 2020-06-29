const { neo4jgraphql } = require("neo4j-graphql-js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

const crearToken = (user, secret, expiresIn) => {
  const { userId, email, name } = user;
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
        const userId = await jwt.verify(token, process.env.SECRETWORD);
        console.log(JSON.stringify(userId));
        return userId;
      } catch (error) {
        console.log(error);
        return new Error("No se pudo obtener el usuario");
      }
    },
    getUser: async (_,{},ctx)=>{
      try {
        console.log(ctx.user);
        return ctx.user;
      } catch (error) {
        throw new Error("No se pudo obtener el usuario");
      }
    }
  },

  Mutation: {
    updateUser: async (obj, {input}, context)=>{
      try {
        console.log("update user");
        const res = await session.run("MATCH(n:User {email:$email}) RETURN n", {
          email: input.email,
        });
        session.close();
        if (!res.records.length) {
          return new Error("El correo no existe!");
        }
        input.password = await bcryptjs.hash(input.password, 10);
        const mutation = await session.run(
          "MATCH(n:User {email:$email}) RETURN n SET n.password = $password RETURN n",
          {
            email: input.email,
            password: input.password
          }
        );
        console.log("mutation: "+mutation);
        console.log("ok");
        session.close();
        return input;
      } catch (error) {
        console.log(error);
        return new Error("No se pudo actualizar!");
      }
    }, 
    newUser: async (obj, { input }, context) => {
      try {
        console.log("entra");
        const session = context.driver.session();
        // const salt = await bcryptjs.getSalt(10);
        input.password = await bcryptjs.hash(input.password, 10);
        const re = await session.run(
          "CREATE (n:User {userId:$userId, name:$name,email:$email,password:$password,active:$active,exists:$exists,employeeNumber:$employeeNumber}) RETURN n",
          {
            userId: input.userId,
            name: input.name,
            email: input.email,
            password: input.password,
            active: input.active,
            exists: input.exists,
            employeeNumber: input.employeeNumber
          }
        );
        console.log(JSON.stringify(re));
        console.log("sale");
        
        session.close();
        return input;
      } catch (e) {
        console.log(e);
        return new Error("No se pudo crear usuario!");
      }
    },
    
    authUser: async (obj, { input }, context, info) => {
      try {
        const { email, password } = input;
        const session = context.driver.session();
        const res = await session.run("MATCH(n:User {email:$email}) RETURN n", {
          email: input.email,
        });
        session.close();
  
        if (!res.records.length) {
            return new Error("El correo no existe!");
        }
        // validar contraseña
        const user = res.records[0]._fields[0].properties;
        const passwordCorret = await bcryptjs.compare(
          input.password,
          user.password
        );
        if (!passwordCorret) {
          return new Error("el password no es correcto");
        }
        return {
          token: crearToken(user, process.env.SECRETWORD, "24h"),
        };
      } catch (error) {
        return new Error("No se puedo autenticar");
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
