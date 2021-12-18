// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Escrow is AccessControl{

    // roles
    bytes32 public constant Agent = keccak256("AGENT");
    bytes32 public constant Sender = keccak256("SENDER");
    bytes32 public constant Receiver = keccak256("RECEIVER");

    // time limit
    uint256 timeLimit = 15 seconds;

    // contract deploy time
    uint256 deployTime;

    // receiver => amount mapping
    mapping(address => uint256) receiver_amount;



    constructor(){
        // set deployTime
        deployTime = block.timestamp;

        // set agent role
        _grantRole(Agent, msg.sender);

    }


    // deposite function
    function DepositeFor(address receiver) public payable{

        // set deployTime again so every time the user deposite, it set deploytime to current time
        deployTime = block.timestamp;

        // set the role of sender 
        _grantRole(Sender, msg.sender);


        // set role of receiver
        _grantRole(Receiver, receiver);

        // set mappings
        receiver_amount[receiver] = msg.value;

    }



    // can be either called by sender or receiver
    function Withdraw() public {
        // time differnce
        uint256 deltaTime = block.timestamp - deployTime;

        if (hasRole(Sender, msg.sender)) {
            // if sender called
            // require that the contract have at least some balance in it
            require(address(this).balance > 0, "no funds available");
            // require that 
            require(deltaTime >= timeLimit, "you cant get refund before time limit");
            payable(msg.sender).transfer(address(this).balance);
        } else if (hasRole(Receiver, msg.sender)){
            // if receiver called
            require(deltaTime < timeLimit, "time is up, the funds are returned to the sender");
            payable(msg.sender).transfer(receiver_amount[msg.sender]);
        }

    }



    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }


}
