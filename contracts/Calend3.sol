// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calend3 {
    uint rate;
    address payable public owner;

    struct Appointment{
        string title;
        address attendee;
        uint startTime;
        uint endTime;
        uint amountPaid;
    }

    Appointment[] appointments;

    constructor(){
        owner = payable(msg.sender);
    }

    function getRate() public view returns (uint){
        return rate;
    }
    
    function setRate(uint _rate) public {
        require(msg.sender==owner, "Only the owner can set the rate");
        rate = _rate;
    }

    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }

    function createAppointment(string memory title, uint startTime, uint endTime) public payable {
        Appointment memory appointment;
        appointment.title = title;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        appointment.amountPaid = ((endTime-startTime)/60)*rate;
        appointment.attendee = msg.sender;

        // validate the amount of eth
        require(msg.value >= appointment.amountPaid, "We need more ether");

        (bool success,) = owner.call{value: msg.value}(""); //send eth to the owner
        require(success, "Failes to send ether");
        appointments.push(appointment);
    }
}