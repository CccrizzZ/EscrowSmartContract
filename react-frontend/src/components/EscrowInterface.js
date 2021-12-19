import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import { Modal, Button, FormControl, InputGroup, ListGroup } from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {ethers} from 'ethers'

// alchemy web3 variables
const web3 = createAlchemyWeb3(process.env.REACT_APP_API_ENDPOINT)
const contractABI = require('./contract-abi.json')
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

// contract instance
const EscrowContract = new web3.eth.Contract(
  contractABI,
  contractAddress
)




// metamask onboarding variables
let onboarding




export default class EscrowInterface extends Component {

    constructor(props){
        super(props)
        this.state = {
            // metamask
            onboarding: {},
            isConnected: false,    // is wallet connected
            accounts: [],          // connect account
            network: [],           // connected network

            // contract variables
            time: 30,
            Amount: 0,
            RAddress: 0,
        }
    


    }

    async componentDidMount(){
        
        // handle account change listener
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log("account changed to:")
            console.log(accounts)
            
            // connect to wallet
            this.ConnectToWallet()
        
        })


        // call the contract get time left


    }

    componentWillUnmount(){
        // solve the warning
        this.setState = () => false
    }




    // connect wallet button
    OnConnectButtonClicked = () => {
        
        // if not initiated onboarding, init
        if (!onboarding) {
            onboarding = new MetaMaskOnboarding();
        }

        
        // determine if metamask is installed
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            console.log("Metamask is already installed, connecting...")

            // stop onboarding
            onboarding.stopOnboarding()
            
            // connect to wallet
            this.ConnectToWallet()

            // get current entwork
            this.GetCurrentNetwork()

        }else{
            // popup the download page
            console.log("Metamask is not installed, popup the download page")
            onboarding.startOnboarding()
        }
    }


    // connect to current wallet
    ConnectToWallet = async () => {
        // connect the wallet
        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((ConnectedAccount) => {
            // set account address
            this.setState({ accounts: ConnectedAccount })
            
            // set connection state
            this.setState({ isConnected: true })
        })
    }



    // Network	Chain Id
    // Mainnet	1
    // Kovan	42
    // Rinkeby	4
    // Ropsten	3
    // Goerli	5


    
    // set current network
    GetCurrentNetwork = async () => {
        try {
            // get provider
            // provider = await detectEthereumProvider()
            this.setState({ provider: await detectEthereumProvider()})


            // get network
            switch (this.state.provider.networkVersion) {
                case "1":
                    this.setState({ network: "Mainnet"})
                    break;
                case "42":
                    this.setState({ network: "Kovan"})
                    break;
                case "4":
                    this.setState({ network: "Rinkeby"})
                    break;
                case "3":
                    this.setState({ network: "Ropsten"})
                    break;
                case "5":
                    this.setState({ network: "Goerli"})
                    break;
                default:
                    break;
            }
        }catch (err) {
            throw err
            console.log(err)
        }
    }

    
    // returns text according to wallet connection state
    GetConnectedText = () => {
        if (this.state.isConnected) {
            return "Connected"
        } else {
            return "Connect Wallet"
        }
    }

  

    // Escrow functions
    UpdateAmount = (e) => {
        this.setState({Amount: e.target.value})
    }
    UpdateAddress = (e) => {
        this.setState({RAddress: e.target.value})
    }
    Deposit = async () => {

        console.log("Deposit called by: " + this.state.accounts)
        console.log("Amount: " + this.state.Amount)
        console.log("Address: " + this.state.RAddress)

        // convert ether value to wei
        // console.log("amount in wei: " + web3.utils.toWei(web3.utils.toBN(this.state.Amount), 'ether'))


        console.log((this.state.RAddress).toString())

        // call contract deposit function
        await EscrowContract.methods
        .DepositeFor((this.state.RAddress).toString())
        .send({
            from: this.state.accounts[0],
            value: web3.utils.toBN(this.state.Amount)
        })


    }
    Withdraw = async () => {
        console.log("Withdraw called by: " + this.state.accounts)


        // call contract function here
        await EscrowContract.methods
        .Withdraw()
        .send({from: this.state.accounts })

    }
    GetTimeLeft = async () => {


    }
    GetContractBalance = async () => {
        let balance = await EscrowContract.methods.getBalance().call()
        console.log(balance)
    }


    render() {
        return (
            <div>

                {/* the wallet connection button */}
                <div style={{width: '200px', margin: 'auto'}}>
                    <Button variant="primary" onClick={this.OnConnectButtonClicked} disabled={this.state.isConnected}>{this.GetConnectedText()}</Button>
                    <Button variant="primary" onClick={this.GetContractBalance}>GetContractBalance</Button>
                </div>


                {/* deposit modal */}
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Escrow Deposit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="amt">Amount (in ETH)</InputGroup.Text>
                            <FormControl type="number" aria-label="Amount" aria-describedby="amt" onChange={this.UpdateAmount}/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="addr">Address</InputGroup.Text>
                            <FormControl aria-label="Recipient's Address" aria-describedby="addr" onChange={this.UpdateAddress} />
                        </InputGroup>
                        <Button variant="success" onClick={this.Deposit}>Deposit</Button>
                    </Modal.Body>
                </Modal.Dialog>


                {/* withdraw modal */}
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Escrow Withdraw</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>Time Left to Withdraw: {this.state.time}</h3>
                        <Button variant="warning" onClick={this.Withdraw}>Withdraw</Button>
                    </Modal.Body>
                </Modal.Dialog>


                <ListGroup style={{width: "50%", margin: "auto"}}>
                    <ListGroup.Item>Connected Account</ListGroup.Item>
                    <ListGroup.Item>{this.state.accounts}</ListGroup.Item>
                </ListGroup>
                
                <ListGroup style={{width: "50%", margin: "auto"}}>
                    <ListGroup.Item>Current Network</ListGroup.Item>
                    <ListGroup.Item>{this.state.network}</ListGroup.Item>
                </ListGroup>
                <ListGroup style={{width: "50%", margin: "auto"}}>
                    <ListGroup.Item>Contract Address</ListGroup.Item>
                    <ListGroup.Item>0x95aB7926CAB6412c837a6370f5BBCFc23372141e</ListGroup.Item>
                </ListGroup>
            </div>
        )
    }
}
