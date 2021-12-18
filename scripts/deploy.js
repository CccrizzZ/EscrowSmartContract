const hre = require("hardhat")
async function main() {

    // grab the Escrow contract
    const Escrow = await hre.ethers.getContractFactory("Escrow")
    
    // deploy the contract with await 
    const contract = await Escrow.deploy()
  
    // confirm deployment
    await contract.deployed()
    
    // log the address of the deployed contract
    console.log("Escrow deployed to:", contract.address)
}

// deployed to 0x95aB7926CAB6412c837a6370f5BBCFc23372141e

// run the main function
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});