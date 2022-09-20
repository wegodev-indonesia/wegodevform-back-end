import answer from '../models/Answer.js';
import { faker } from '@faker-js/faker';

const run = async (limit) => {
    try {
        var data = [];
        for (var i = 0; i < limit; i++) {
            data.push({
                '6321497603df722a27b35600': faker.name.fullName(),
                '6321499a03df722a27b3560d': faker.internet.email(),
                '632149b303df722a27b35613': faker.helpers.arrayElement(['Pria', 'Wanita']),
                '6324b3bd362aba63469a49fb': faker.helpers.arrayElements(['Dendeng', 'Rendang', 'Semur', 'Nasi Uduk', 'Bubur Ayam']),
                '6326d2f8652595441e17417b': faker.helpers.arrayElement(['38', '39', '40', '41', '41', '42', '43']),
                'userId': '630b05daccc0ea20356d6e8e',
                'formId': '6321497603df722a27b355fe'
            })
        }

        const fakeData = await answer.insertMany(data);

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