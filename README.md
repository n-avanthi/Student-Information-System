# Student Information System

This project is a decentralized application (DApp) which harnesses blockchain technology and smart contracts to streamline student data management. It is built on Ethereum blockchain and uses Solidity for backend smart contracts and React JS for frontEnd. Some of the features include - adding students by updating details and paying an admission fee; updating attendance and grade per course; fetching all student USN's; fetching student grade and attendace based on student's USN. Updating grade and attendance can only be done by the owner to ensure data security.  

## Technologies Used

- Solidity: Utilized as the programming language for the smart contract to manage student data efficiently
- Ethereum: Employed as the blockchain network for deploying and executing the smart contracts.
- Sepolia Testnet: Utilized as the Ethereum test network for deploying and testing smart contracts.
- Hardhat: Employed as the Ethereum development environment to compile, deploy, and test smart contracts.
- React:  Employed as the frontend framework for constructing the user interface.
- Web3.js: Utilized as the JavaScript library for interfacing with the Ethereum blockchain from the frontend.

## Installation

1. Clone the repository:
   
   ```bash
   git clone https://github.com/n-avanthi/Student-Information-System.git
   ```
   
2. Install dependancies 
- For frontend
    ``` bash
    cd react
    npm install
    ```
- For backend
    ``` bash
    cd solidity
    npm install
    ```

## To deploy a contract on the network

1. Change the directory to Solidity
    ``` bash
    cd solidity
    ```

2. Set your 'ALCHEMY_API_KEY' and 'SEPOLIA_PRIVATE_KEY' environment variables present in hardhat.config.js file
     ``` bash
    npx hardhat vars set ALCHEMY_API_KEY
    ```
    ``` bash
    npx hardhat vars set SEPOLIA_PRIVATE_KEY
    ```
    To view the environment variables already set up,
    ``` bash
    npx hardhat vars setup
    ```

4. Compile the contract
    ```bash
    npx hardhat compile
    ```

5. Deploy the contract 
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Token.js --network sepolia
    ```

## React frontend

1. If the contract is deployed again, navigate to react/src/App.js and change the deployed contract address
    ```javascript
    const CONTRACT_ADDRESS = "redeployed-contract-address";
    ```
 and then navigate to `solidity/artifacts/contracts/Student-Information-System.json` and copy the contents of this file into `frontend/src/utils/Student-Information-System.json`

2. Start the react server
    ```bash
    npm start
    ```
