import fs from 'fs';

async function globalTeardown() {
  await fs.unlink('data.json', (err) => {
    if (err) {
      throw err;
    }
  });
}

export default globalTeardown;