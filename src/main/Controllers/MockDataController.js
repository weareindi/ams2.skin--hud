import fs from 'node:fs';

export default class MockDataController {
    async data(state) {
        const data = fs.readFileSync(`./resources/mock/${state}`, { encoding: 'utf8' });
        return JSON.parse(data);
    }
}