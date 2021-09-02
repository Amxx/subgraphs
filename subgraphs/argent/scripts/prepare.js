const fs   = require('fs');
const path = require('path');
const ethers = require('ethers');

Array.prototype.unique = function(op = x => x) {
    return this.filter((obj, i) => this.findIndex(entry => op(obj) === op(entry)) === i);
}


for (const name of [ 'BaseWallet', 'WalletFactory' ]) {
    const DIR = `abis/contracts/${name}`;

    const factories = fs.readdirSync(DIR)
        .map(path.parse)
        .filter(file => file.ext === '.json');

    const abi = factories
        .map(file => fs.readFileSync(path.join(DIR, file.base)))
        .flatMap(JSON.parse)
        .filter(entry => entry.name) // remove constructor
        .map(entry => Object.assign(entry, { signature: `${entry.name}(${entry.inputs.map(input => input.type).join()})` }))
        .unique(entry => entry.signature)

    const interface = new ethers.utils.Interface(abi);

    console.log(`${name} Addresses:`, factories.map(file => file.name));
    console.log(`${name} ABI:`, Object.keys(interface.events))

    fs.writeFileSync(`artifacts/${name}.json`, JSON.stringify(abi));
}

{
    const DIR = 'abis/modules';

    const abi = fs.readdirSync(DIR)
    .flatMap(module => fs.readdirSync(path.join(DIR, module)).map(file => path.join(module, file)))
    .map(path.parse)
    .filter(file => file.ext === '.json')
    .map(file => fs.readFileSync(path.join(DIR, file.dir, file.base)))
    .flatMap(JSON.parse)
    .filter(entry => ![ null, undefined, 'Address'].includes(entry.name)) // remove constructor & conflicting names
    .map(entry => Object.assign(entry, { signature: `${entry.name}(${entry.inputs.map(input => input.type).join()})` }))
    .unique(entry => entry.signature);

    const interface = new ethers.utils.Interface(abi);
    console.log('Modules ABI:', Object.keys(interface.events))

    fs.writeFileSync('artifacts/Module.json', JSON.stringify(abi));
}

{
    const DIR = 'src/datasources/modules';

    const all = fs.readdirSync(DIR)
        .map(path.parse)
        .filter(file => file.ext === '.json')
        .map(file => fs.readFileSync(path.join(DIR, file.base)))
        .flatMap(JSON.parse)

    const reduced = all
        .map(entry => entry.name)
        .unique()
        .map(key => all.filter(entry => entry.name === key))
        .map(entries => Object.assign(entries.find(Boolean), { fields: entries.flatMap(entry => entry.fields).unique(entry => entry.name) }))

    fs.writeFileSync('src/datasources/Module.gql.json', JSON.stringify(reduced));
}