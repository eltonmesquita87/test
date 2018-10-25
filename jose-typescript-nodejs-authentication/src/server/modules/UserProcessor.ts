import AuthenticatedUser from '../models/AuthenticatedUser';

export class UserProcessor {
  
  constructor() {

  }

  public registerUser(req, res) {
    const username = req.body.username
    const enabled = req.body.enabled

    AuthenticatedUser.find({where: {username: username}})
    .then(user => {     
        if (user === null) {                       
            this.sendResponse(res, "User not found", null)
        } else {
            user.update({
                enabled: enabled
            })
        }
            this.sendResponse(res, "Registration was successful", null)
    });
  }
  /**
   *
   * sends a response created out of the specified parameters to the client.
   *
   * @param res - response to respond to client
   * @param message - message to send to the client
   * @param error - error to send to the client
   */
  private sendResponse(res, message, error) {

    /* Here e create the status code to send to the client depending on whether
    or not the error being passed in is nukk. Then, we create and send
    the json object response to the client */
    res
        .status(error != null ? error != null ? 400 : 200 : 400)
        .json({
            'message': message,
            'error': error,
        })
  }


  /**
   *
   * Returns true the specified parameters is a string else it returns false
   *
   * @param parameter - the variable we're checking is a String
   * @return {boolean}
   */
  private isString(parameter) {

      return parameter != null && (typeof parameter === "string"
                                          || parameter instanceof String) ? true : false
  }


}

export default UserProcessor;