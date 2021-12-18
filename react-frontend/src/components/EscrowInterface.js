import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import { Modal, Button, FormControl, InputGroup, ListGroup } from 'react-bootstrap';



// metamask
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider';
// import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// metamask variables
let onboarding
// const web3 = createAlchemyWeb3(process.env.API_ENDPOINT)


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
    Deposit = () => {
        console.log("Deposit called")
        console.log("Amount: " + this.state.Amount)
        console.log("Address: " + this.state.RAddress)

        // call contract function here

    }
    Withdraw = () => {
        console.log("Withdraw called")
        console.log()

        // call contract function here
        
    }
    GetTimeLeft = () => {
        
    }


    render() {
        return (
            <div>

                {/* the wallet connection button */}
                <div style={{width: '200px', margin: 'auto'}}>
                    <Button variant="primary" onClick={this.OnConnectButtonClicked} disabled={this.state.isConnected}>{this.GetConnectedText()}</Button>
                </div>


                {/* deposit modal */}
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Escrow Deposit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="amt">Amount (in ETH)</InputGroup.Text>
                            <FormControl aria-label="Amount" aria-describedby="amt" onChange={this.UpdateAmount}/>
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
            </div>
        )
    }
}
