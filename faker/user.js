import user from '../models/User.js';
import { faker } from '@faker-js/faker';

const run = async (limit) => {
    try {
        var data = [];
        for (var i = 0; i < limit; i++) {
            data.push({
                fullname: faker.name.fullName(),
                email: faker.name.fullName(),
                password: 'password',
            })
        }

        const fakeData = await user.insertMany(data);

        if(fakeData) {
            console.log(fakeData)

            process.exit()
        }
    } catch (err) {
        console.log(err)
        
        process.exit()
    }
}

export { run };