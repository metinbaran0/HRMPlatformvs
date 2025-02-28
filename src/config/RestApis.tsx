const prodUrl = '';
const testUrl = '';
const devUrl = 'http://localhost:9090/v1/dev';

const server = devUrl;

const apis = {
  
    userService: server + '/user',
    leaveService: server + '/leave',
    employeeService: server + '/employee',
    
   
}

export default apis;