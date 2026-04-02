import fs from 'fs';
import('./src/server.js').catch(e => {
    fs.writeFileSync('error.txt', e.message);
});
