# Contractor-Crypto

## Quick start

Cloning the project

```sh
git clone https://github.com/santoshimz/contractor-crypto.git
cd contractor-crypto
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
Deploy the contract - npx hardhat run scripts/deployFreeLancer.js --network localhost 
Send 1 ETH to your address - npx hardhat --network localhost faucet 0x2bD192be3EC8C86a75C7d7a2d0aDD7ABAa27078f (Replace the address with the address from Metamask)
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

