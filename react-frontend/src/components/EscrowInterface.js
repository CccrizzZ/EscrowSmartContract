import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import { Modal, Button, FormControl, InputGroup } from 'react-bootstrap';
import { InjectConnector, NetworkOnlyConnectors } from 'web3-react'

const MetaMask = new InjectConnector({supportedNetworks: [1,4]})
const Alchemist = new NetworkOnlyConnectors({
    providerURL: ''
})



export default class EscrowInterface extends Component {

    constructor(props){
        super(props)
        this.state = {
            time: 30,
            Amount: 0,
            RAddress: 0,
        }

    }

    componentDidMount(){
        // setInterval(() => {
        //     if (this.state.time > 0) {
        //         this.setState({time: this.state.time - 1})
        //     }
        // }, 1000)
    }

    componentWillUnmount(){
        this.setState = () => false
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
    }
    Withdraw = () => {
        console.log("Withdraw called")
        console.log()
    }



    render() {
        return (
            <div>
                <div style={{width: '200px', margin: 'auto'}}>
                    <Button variant="primary">Connect Wallet</Button>
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
            </div>
        )
    }
}
