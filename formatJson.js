const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { neatJSON } = require('neatjson');

const dataDirectory = 'src/data';

const files = fs.readdirSync(dataDirectory);

const opts = { wrap: 70, padding: 1, afterComma: 1, afterColon: 1 };

files.forEach((file) => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(dataDirectory, file);
    const rawData = fs.readFileSync(filePath, 'utf-8');

    try {
      const jsonData = JSON.parse(rawData);

      fs.writeFileSync(`${filePath}`, neatJSON(jsonData, opts), 'utf-8');

      console.log(`Writing: ${filePath}`);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
    }
  }
});
