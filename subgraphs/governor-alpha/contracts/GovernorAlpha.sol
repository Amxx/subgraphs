pragma solidity ^0.8.0;

interface IGovernorAlpha {
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

    // ProposalCreated
    event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description);
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




    event ProposalQueued(uint256 id, uint256 eta);
    event ProposalExecuted(uint256 id);
    event VoteCast(address voter, uint256 proposalId, bool support, uint256 votes);
    event ProposalCanceled(uint256 id);
}

interface ITimelock {
    function delay() external view returns (uint256);
    function GRACE_PERIOD() external view returns (uint256);
    function acceptAdmin() external;
    function queuedTransactions(bytes32 hash) external view returns (bool);
    function queueTransaction(address target, uint256 value, string calldata signature, bytes calldata data, uint256 eta) external returns (bytes32);
    function cancelTransaction(address target, uint256 value, string calldata signature, bytes calldata data, uint256 eta) external;
    function executeTransaction(address target, uint256 value, string calldata signature, bytes calldata data, uint256 eta) external payable returns (bytes memory);
}

interface IComp {
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);
}
