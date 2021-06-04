const axios = require('axios')
const MODULES = require('./src/modules.json')

function run(url, query, variables) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, { query, variables })
      .then(res => {
        resolve(res.data.data)
      })
      .catch(reject)
  });
}

async function main () {
  const { modules } = await run(
    'https://api.thegraph.com/subgraphs/id/QmTX1ePDcBRzJQGYEy8qsedgpNpNz3ybQqHw2Gs8Mf7xAz',
    '{ modules { id }}'
  );

  console.log(`Modules:`);
  console.log(`- ${modules.length} found`);
  console.log(`- ${Object.values(MODULES).length} registered`);

  const missing = modules.filter(({ id }) => !MODULES[id])
  if (missing.some(Boolean)) {
    for (const { id } of missing) {
      console.log(`Missing module: ${id}`);
    }
  } else {
    console.log('All good.')
  }

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
