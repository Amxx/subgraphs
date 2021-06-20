// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";
import "./IBaseTransfer.sol";
import "./ILimitManager.sol";

interface ITransferManager is IBaseModule, IRelayerModule, IBaseTransfer, ILimitManager {
    event AddedToWhitelist(address indexed wallet, address indexed target, uint64 whitelistAfter);
    event RemovedFromWhitelist(address indexed wallet, address indexed target);
    event PendingTransferCreated(address indexed wallet, bytes32 indexed id, uint256 indexed executeAfter, address token, address to, uint256 amount, bytes data);
    event PendingTransferExecuted(address indexed wallet, bytes32 indexed id);
    event PendingTransferCanceled(address indexed wallet, bytes32 indexed id);

    function transferToken(address _wallet, address _token, address _to, uint256 _amount, bytes calldata _data) external;
    function approveToken(address _wallet, address _token, address _spender, uint256 _amount) external;
    function callContract(address _wallet, address _contract, uint256 _value, bytes calldata _data) external;
    function approveTokenAndCallContract(address _wallet, address _token, address _contract, uint256 _amount, bytes calldata _data) external;
    function addToWhitelist(address _wallet, address _target) external;
    function removeFromWhitelist(address _wallet, address _target) external;
    function executePendingTransfer(address _wallet, address _token, address _to, uint256 _amount, bytes calldata _data, uint256 _block) external;
    function cancelPendingTransfer(address _wallet, bytes32 _id) external;
    function changeLimit(address _wallet, uint256 _newLimit) external;
    function disableLimit(address _wallet) external;

    function isWhitelisted(address _wallet, address _target) external view returns (bool _isWhitelisted);
    function getPendingTransfer(address _wallet, bytes32 _id) external view returns (uint64 _executeAfter);
}
