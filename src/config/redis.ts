import * as redis from 'redis';

let client:any;
client = redis.createClient();
client.on("error", (error:any) => console.error(`Error : ${error}`));
client.connect().then((res:any)=>console.log('sucess'))

export default client;