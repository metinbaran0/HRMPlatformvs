const prodUrl = '';
const testUrl = '';
const devUrl = 'http://localhost:9090/api/auth';

const server = devUrl;

const apis = {
  
    userService: server + '/user',
    LOGIN: '/dologin',
   REGISTER: '/register',
    
   
}

export default apis;