const prodUrl = '';
const testUrl = '';
const devUrl = 'http://localhost:9090/api/auth';

const server = devUrl;

const apis = {
  
    userService: server + '/user',

    leaveService: server + '/leave',
    employeeService: server + '/employee',

    LOGIN: '/dologin',
   REGISTER: '/register',

    
   
}

export default apis;