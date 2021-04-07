pragma solidity ^0.8.0;

interface ITimelock {
    event NewAdmin(address indexed newAdmin);
    event NewPendingAdmin(address indexed newPendingAdmin);
    event NewDelay(uint indexed newDelay);
    event CancelTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature,  bytes data, uint eta);
    event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature,  bytes data, uint eta);
    event QueueTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);

    function admin() external view returns (address);
    function pendingAdmin() external view returns (address);

    function delay() external view returns (uint256);
    function GRACE_PERIOD() external view returns (uint256);
    function MINIMUM_DELAY() external view returns (uint256);
    function MAXIMUM_DELAY() external view returns (uint256);
    function setDelay(uint256) external;
    function setPendingAdmin(address) external;
    function acceptAdmin() external;
    function queuedTransactions(bytes32) external view returns (bool);
    function queueTransaction(address, uint256, string calldata, bytes calldata, uint256) external returns (bytes32);
    function cancelTransaction(address, uint256, string calldata, bytes calldata, uint256) external;
    function executeTransaction(address, uint256, string calldata, bytes calldata, uint256) external payable returns (bytes memory);
}
