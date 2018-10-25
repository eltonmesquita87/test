import router from '../../router'


export default {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  install: (Vue, options) => {    
  	Vue.prototype.$helpers = {
      loginUrl() {
        return fetch(this.urlPrefix() + '/login').then(data => {
          return data.json().then(url => {            
            window.location = url.url;
          })    
        })
      },
      urlPrefix() {
        return 'http://' + options.server + ':' + options.port
      },
      login(code) {
        return fetch(this.urlPrefix() + '/login/oauthCallBack?code=' + code).then(data => {
          return data.json().then(response => {
            window.sessionStorage.accessToken = response.token;
            window.location.href = '../'
          })    
          })  
      },
      connectTo(url, method = 'get', data = null) {  
        var token = window.sessionStorage.accessToken
        if (token == "" || token == undefined) {
          router.push('login');        
          return;          
        }

        if(data != null) {
          data = JSON.stringify(data)
        }                      

        return fetch(url, {           
          method: method,
          headers: {      
            'Authorization': 'Bearer ' + token.trim(),       
            'Content-Type': 'application/json'
          },
          body: data
        })
        .then((response) => {
          if(response.status == 401) {        
            document.cookie = "";
            router.push('login');        
          }
          console.log(response);
          return response          
        }).catch((error) => {
          console.log("error connecting to api " + url + ":" + error);      
          document.cookie = "";
          router.push('login');     
        })
      }
    }
  }
};
