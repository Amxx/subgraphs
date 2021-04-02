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
    uint256   abstainVotes;
    bool      canceled;
    bool      executed;
}

struct Receipt {
    bool      hasVoted;
    uint8     support;
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

interface IGovernorBravo {
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description);
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason);
    event ProposalCanceled(uint256 id);
    event ProposalQueued(uint256 id, uint256 eta);
    event ProposalExecuted(uint256 id);
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event NewImplementation(address oldImplementation, address newImplementation);
    event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
    event NewPendingAdmin(address oldPendingAdmin, address newPendingAdmin);
    event NewAdmin(address oldAdmin, address newAdmin);

    function admin() external view returns (address);
    function pendingAdmin() external view returns (address);
    function implementation() external view returns (address);

    function name() external view returns (string memory);
    function quorumVotes() external view returns (uint256);
    function proposalThreshold() external view returns (uint256);
    function proposalMaxOperations() external view returns (uint256);
    function votingDelay() external view returns (uint256);
    function votingPeriod() external view returns (uint256);
    function timelock() external view returns (address);
    function comp() external view returns (address);
    function proposalCount() external view returns (uint256);
    function proposals(uint256) external view returns (Proposal memory);
    function latestProposalIds(address) external view returns (uint256);
    function getActions(uint256 proposalId) external view returns (address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas);
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory);
    function state(uint256 proposalId) external view returns (ProposalState);

    function DOMAIN_TYPEHASH() external view returns (bytes32);
    function BALLOT_TYPEHASH() external view returns (bytes32);
}
