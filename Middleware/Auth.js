import token from '../Services/Token';

export default {
    verifyUser: async (req,driver) =>{
      if(!req.headers.token){
        console.log('aaa');
        return new Error('No Token');

      }

      const response= await token.decode(req.headers.token,driver);

      if(response){
        return 'Authorized';
    }
      else{
          return new Error('Not authorized');
      }
    }
}