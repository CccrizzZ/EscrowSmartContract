const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

sleep = miliseconds => new Promise((resolve) => {setTimeout(resolve, miliseconds)})


describe('Escrow', async function () {
    // contract instance
    let EscrowInstance

    // addresses
    let Agent
    let Alice
    let Bob

    // init tests
    before(async () => {
        // setup accounts
        [Agent, Alice, Bob] = await ethers.getSigners() 

        // deploy contract instance
        const EscrowContract = await ethers.getContractFactory("Escrow")
        EscrowInstance = await EscrowContract.deploy()

    })

    it('Agent account have agent role', async () => {
        expect(await EscrowInstance.hasRole(EscrowInstance.Agent(), Agent.address)).to.equal(true)
    })


    it('Alice have sender role, Bob have receiver role', async () => {
        // alice deposite 1 ether for bob
        await EscrowInstance.connect(Alice).DepositeFor(Bob.address, {value: ethers.utils.parseEther("1.0")})
        expect(await EscrowInstance.hasRole(EscrowInstance.Sender(), Alice.address)).to.equal(true)
        expect(await EscrowInstance.hasRole(EscrowInstance.Receiver(), Bob.address)).to.equal(true)
    })


    it('Alice can not get refund before the time limit', async () => {

        try {
            await EscrowInstance.connect(Alice).Withdraw()
        }catch(err){
            assert.include(err.message, "you cant get refund before time limit", "the errow should contain this")
            expect(err.message).to.equal("VM Exception while processing transaction: reverted with reason string 'you cant get refund before time limit'")
        }
    })


    it('Bob can withdraw from the escrow if in time limit', async () => {

        // bob withdraw
        expect(parseInt(await EscrowInstance.getBalance())).to.be.above(0)
        await EscrowInstance.connect(Bob).Withdraw()
        expect(parseInt(await EscrowInstance.getBalance())).to.be.equal(0)
    })


    
    it('Alice can refund from the escrow if out of time limit', async () => {
        // deposit another eth
        await EscrowInstance.connect(Alice).DepositeFor(Bob.address, {value: ethers.utils.parseEther("1.0")})
        
        // wait for 15 seconds
        await sleep(15000)

        // alice get refund
        expect(parseInt(await EscrowInstance.getBalance())).to.be.above(0)
        await EscrowInstance.connect(Alice).Withdraw()
        expect(parseInt(await EscrowInstance.getBalance())).to.be.equal(0)
    })




})

