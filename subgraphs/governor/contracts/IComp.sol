pragma solidity ^0.8.0;

interface IComp {
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);
}
