pragma solidity ^0.8.0;

struct ProposalAlpha {
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

struct ProposalBravo {
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

struct ReceiptAlpha {
    bool      hasVoted;
    bool      support;
    uint96    votes;
}

struct ReceiptBravo {
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

interface IGovernor {
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description);
    event VoteCast(address voter, uint256 proposalId, bool support, uint256 votes);
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason);
    event ProposalQueued(uint256 id, uint256 eta);
    event ProposalExecuted(uint256 id);
    event ProposalCanceled(uint256 id);
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
    event NewAdmin(address oldAdmin, address newAdmin);
    event NewPendingAdmin(address oldPendingAdmin, address newPendingAdmin);
    event NewImplementation(address oldImplementation, address newImplementation);

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
    function guardian() external view returns (address);
    function proposalCount() external view returns (uint256);
    // function proposals(uint256) external view returns (ProposalAlpha memory);
    // function proposals(uint256) external view returns (ProposalBravo memory);
    function latestProposalIds(address) external view returns (uint256);
    function getActions(uint256 proposalId) external view returns (address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas);
    // function getReceipt(uint256 proposalId, address voter) external view returns (ReceiptAlpha memory);
    // function getReceipt(uint256 proposalId, address voter) external view returns (ReceiptBravo memory);
    function state(uint256 proposalId) external view returns (ProposalState);

    function DOMAIN_TYPEHASH() external view returns (bytes32);
    function BALLOT_TYPEHASH() external view returns (bytes32);

    // ProposalCreated1
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string title, string description);
    // ProposalCreated2
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description);
    // ProposalCreated3
    event ProposalCreated(uint256 id, address proposer, address[] targets, string[] signatures, bytes[] calldatas, string description);
    // ProposalCreated4
    event ProposalCreated(
        uint256 indexed id,
        address proposer,
        address[] contracts,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        bool expedited
    );
    // ProposalCreated5
    event ProposalCreated(uint256 id, address proposer, uint256 startBlock, uint256 endBlock, string description);
}
