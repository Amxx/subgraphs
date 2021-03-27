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
    function getActions(uint proposalId) external view returns (address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas);
    function getReceipt(uint proposalId, address voter) external view returns (Receipt memory);
    function state(uint proposalId) external view returns (ProposalState);

    event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startBlock, uint endBlock, string description);
    event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startBlock, uint endBlock, string title, string description);
    event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, string description);

    event ProposalQueued(uint id, uint eta);
    event ProposalExecuted(uint id);
    event VoteCast(address voter, uint proposalId, bool support, uint votes);
    event ProposalCanceled(uint id);
}

interface ITimelock {
    function delay() external view returns (uint);
    function GRACE_PERIOD() external view returns (uint);
    function acceptAdmin() external;
    function queuedTransactions(bytes32 hash) external view returns (bool);
    function queueTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external returns (bytes32);
    function cancelTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external;
    function executeTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external payable returns (bytes memory);
}

interface IComp {
    function getPriorVotes(address account, uint blockNumber) external view returns (uint96);
}
