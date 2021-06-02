pragma solidity ^0.8.0;

interface IProxy {
  event Received(uint indexed value, address indexed sender, bytes data);
}
