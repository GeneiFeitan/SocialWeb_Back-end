import token from '../Services/Token';

export default {
    verify: async (req,driver) =>{
      if(!req.headers.token){
        console.log('aaa');
        return new Error('No Token');

      }
      const response= await token.decode(req.headers.token,driver);
      console.log(response);
      if(response.rol=='Admin'||response.rol=='User'){
        return 'Authorized';
    }
      else{
          return new Error('Not authorized');
      }
    },

    verifyAdmin: async (req,driver) =>{
      if(!req.headers.token){
        console.log('aaa');
        return new Error('No Token');

      }
      const response= await token.decode(req.headers.token,driver);
      console.log(response);
      if(response.rol=='Admin'){
        return 'Authorized';
    }
      else{
          return new Error('Not authorized');
      }
    },

    verifyUser: async (req,driver) =>{
      if(!req.headers.token){
        console.log('aaa');
        return new Error('No Token');

      }
      const response= await token.decode(req.headers.token,driver);
      console.log(response);
      if(response.rol=='User'){
        return 'Authorized';
    }
      else{
          return new Error('Not authorized');
      }
    }
}