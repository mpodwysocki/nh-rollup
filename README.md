# Azure SDK Bundler Testbed

This is a testbed for using the Azure SDK with a bundler and to see what differences we can get between a modular exports or the current exports with a classical design pattern.

## Installation

To install, clone the repo and run `npm install` in the root directory.

```bash
git clone https://github.com/mpodwysocki/nh-rollup.git

cd nh-rollup
npm install
```

## Run the Samples

To run the builds for both the classical design and the modular exports, run the following:

```bash
npm run builda
```

This will show the difference in bundle sizes between the two as well as create a `stats.html` and `stats.modular.html` which will analyze the bundles and where the size differences are.

## LICENSE

MIT
