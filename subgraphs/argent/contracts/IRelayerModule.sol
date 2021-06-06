// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IModule.sol";

interface IRelayerModule is IModule {
    event TransactionExecuted(address indexed wallet, bool indexed success, bytes32 signedHash);

    function getNonce(address _wallet) external view returns (uint256 nonce);

    function execute(address _wallet, bytes calldata _data,  uint256 _nonce,  bytes calldata _signatures,  uint256 _gasPrice, uint256 _gasLimit) external returns (bool success);
}
