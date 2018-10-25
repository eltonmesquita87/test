import {Router, Request, Response, NextFunction} from 'express';
import {google} from 'googleapis';
import AuthenticatedUser from '../models/AuthenticatedUser';
import UserAccessToken from '../models/UserAccessToken';
import {Promise} from 'bluebird';

export class GoogleAPIHandler {
  
  public oauth2Client: any

  constructor() {    
    let port = process.env.PORT_NODE || '8081'
    let callBackUrl = process.env.GOOGLE_CALL_BACK_URL || 'http://localhost:' + port

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      callBackUrl)       
  }

  public loginUrl(): String { 
    console.log("Logging the user from Google");

    // generate a url that asks permissions for Google+ and Google Email scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ];
 
    var url = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes 
    });

    return url;
  }

  public login(code): Promise {     
    console.log("login:" + code);       
    this.oauth2Client.getToken = Promise.promisify(this.oauth2Client.getToken)
      return this.oauth2Client.getToken(code).then(tokens => {                
        let access_token = tokens.access_token    
        console.log("token generated:" + access_token);        
        var plus = google.plus('v1');        
        this.oauth2Client.setCredentials(tokens);        

        plus.people.get({ userId: 'me', auth: this.oauth2Client }).then(data =>{          
          let email = data.data.emails[0].value;
          AuthenticatedUser.findOrCreate({where: {username: email}})
          .spread(user => { 
            console.log("create user:" + user.id);
            UserAccessToken.create({ token: access_token, authenticateduserId: user.id, expiration_date: tokens.expiry_date })                         
            
          })     
        });         
        return access_token;
    });
  }
}

export default GoogleAPIHandler;