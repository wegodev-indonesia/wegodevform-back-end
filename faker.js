import { connection } from './connection.js';

//db connection
connection();

const args = process.argv;

// limit
var limit = 10
if(args[3]) {
    limit = args[3]
}

//call faker
const fakerFile = args[2]
const faker = await import(`./faker/${fakerFile}`);
faker.run(limit);
