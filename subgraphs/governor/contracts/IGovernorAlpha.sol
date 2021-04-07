pragma solidity ^0.8.0;

struct Proposal {
    uint256   id;
    address   proposer;
    uint256   eta;
    address[] targets;
    uint256[] values;
    string[]  signatures;
    bytes[]   calldatas;
    uint256   startBlock;
    uint256   endBlock;
    uint256   forVotes;
    uint256   againstVotes;
    bool      canceled;
    bool      executed;
}

struct Receipt {
    bool      hasVoted;
    bool      support;
    uint96    votes;
}

enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

interface IGovernorAlpha {
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description);
    event ProposalQueued(uint256 id, uint256 eta);
    event ProposalExecuted(uint256 id);
    event VoteCast(address voter, uint256 proposalId, bool support, uint256 votes);
    event ProposalCanceled(uint256 id);

    function name() external view returns (string memory);
    function quorumVotes() external view returns (uint256);
    function proposalThreshold() external view returns (uint256);
    function proposalMaxOperations() external view returns (uint256);
    function votingDelay() external view returns (uint256);
    function votingPeriod() external view returns (uint256);
    function timelock() external view returns (address);
    function comp() external view returns (address);
    function guardian() external view returns (address);
    function proposalCount() external view returns (uint256);
    function proposals(uint256) external view returns (Proposal memory);
    function latestProposalIds(address) external view returns (uint256);
    function getActions(uint256 proposalId) external view returns (address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas);
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory);
    function state(uint256 proposalId) external view returns (ProposalState);

    function DOMAIN_TYPEHASH() external view returns (bytes32);
    function BALLOT_TYPEHASH() external view returns (bytes32);
}
