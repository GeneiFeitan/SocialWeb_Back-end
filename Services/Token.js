import jwt from "jsonwebtoken";
require("dotenv").config({ path: "variables.env" });

export default {
  decode: async (token, driver) => {
    try {
      const { userId, email, name } = await jwt.verify(
        token,
        process.env.SECRETWORD
      );

      const session = driver.session();
      const user = await session.run(
        "MATCH (u:User) where u.userId=$userId return u",
        { userId: userId }
      );

      if (user.records.length> 0) {
       const {rol}=user.records[0]._fields[0].properties;
        return {name, email,userId,rol};
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
