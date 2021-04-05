pragma solidity ^0.8.0;

struct Checkpoint {
    uint32 fromBlock;
    uint96 votes;
}

interface IComp {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegateVotesChanged(address indexed delegate, uint previousBalance, uint newBalance);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function allowance(address, address) external view returns (uint256);
    function approve(address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);

    function delegates(address) external view returns (address);
    function checkpoints(address, uint32) external view returns (Checkpoint memory);
    function numCheckpoints(address) external view returns (uint32);
    function nonces(address) external view returns (uint256);
    function delegate(address) external;
    function delegateBySig(address, uint256, uint256, uint8, bytes32, bytes32) external;
    function getCurrentVotes(address) external view returns (uint96);
    function getPriorVotes(address, uint256) external view returns (uint96);

    function DOMAIN_TYPEHASH() external view returns (bytes32);
    function DELEGATION_TYPEHASH() external view returns (bytes32);
}
