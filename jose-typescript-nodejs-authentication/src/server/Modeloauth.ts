import AuthenticatedUser from './models/AuthenticatedUser';
import UserAccessToken from './models/UserAccessToken';
import * as Sequelize from 'sequelize';

const model =  {

  getClient(clientID, clientSecret) {

    console.log("getClient:" + clientID)
    //create the the client out of the given params.
    //It has no functional role in grantTypes of type password
    const client = {
        clientID,
        clientSecret,
        grants: ["password"],
        redirectUris: null
    }
    return client;    
  },

  grantTypeAllowed(clientID, grantType) {
    console.log("grantTypeAllowed!")
    return true;
  },


  async getUser(username, password) {
    console.log("getUser:" + username)
    var user = await AuthenticatedUser.find({ 
      where: { username: username }
    }).then(user => { 
      console.log("got user:" + user.username);
      if(user.authenticate(password)) {
        console.log("user authenticated!")
        return user;
      } else {
        console.log("Invalid login request");
        return null
      }
    })
    .catch(error => {return null})
    return user;        
  },

  saveAccessToken(accessToken, clientID, expires, user, callback){
    console.log("saveAccessToken:" + accessToken)  
    //save the accessToken along with the user.id    
    UserAccessToken.create({ token: accessToken, user: user })
        .then(() => callback(null))
        .catch(error => callback(error))
  },

  saveToken(token, client, user) { 
    console.log("saveToken:" + token.accessToken)
    //save the accessToken along with the user.id
    console.log("user:" + user.id);
    var returnToken = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refresh_token,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      client: client,
      user: user
    };

    var a = UserAccessToken.create({ token: token.accessToken, authenticateduserId: user.id, expiration_date: token.accessTokenExpiresAt })
        .then(() => { return returnToken })
        .catch(error => { return error})    
    return returnToken;
  },

  
  getAccessToken(accessToken) {
    console.log("getToken:" + accessToken)      
    return UserAccessToken.find({    
      where: {
        token: accessToken,
        expiration_date: {
          [Sequelize.Op.gt]: Date.now()
        }
      } ,  
      include: {
        model: AuthenticatedUser,
        where: {enabled: true }

      }                          
    }).then(userAccessToken => {      
      if(userAccessToken == null) {
        console.log("Login invalid for user with token " + accessToken);
        throw new Error("User not found!")
      }      
      let user = userAccessToken.authenticateduser      

      var today = new Date()
      today.setHours(today.getHours()+1)      
      userAccessToken.update({
        expiration_date: today  
      })      
            
      const client = {
        id: user.username,        
        grants: ["password"],
        redirectUris: null
      }
      return {
        accessToken: userAccessToken.accessToken,
        accessTokenExpiresAt: userAccessToken.expiration_date,
        refreshToken: userAccessToken.accessToken,
        refreshTokenExpiresAt: userAccessToken.expiration_date,        
        client: client,
        user: user
      };
    })
    .catch(error => { 
      console.log("Error in getAccessToken: " + error);
      return null 
    })
  },

  createAccessTokenFrom(userID) {
    console.log("createToken:" + userID)
    let user = AuthenticatedUser.find(userID);

    return Promise.resolve({
        user,
        expires: false
    })
  }, 

  saveAuthorizationCode(code, client, user) {
    console.log("saveAuthorizationCode:" + code)
    //save the accessToken along with the user.id
    UserAccessToken.create({ token: code, user: user })
        .then(authorizationCode => { return {
          authorizationCode: code,        
          client: client,
          user: user.username
        }});
  }
}

export default model;

