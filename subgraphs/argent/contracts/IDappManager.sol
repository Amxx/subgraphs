// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";
import "./ILimitManager.sol";

interface IDappManager is IBaseModule, IRelayerModule, ILimitManager {
    event Transfer(address indexed wallet, address indexed token, uint256 indexed amount, address to, bytes data);
    event ContractCallAuthorizationRequested(address indexed _wallet, address indexed _dapp, address indexed _contract, bytes4[] _signatures);
    event ContractCallAuthorizationCanceled(address indexed _wallet, address indexed _dapp, address indexed _contract, bytes4[] _signatures);
    event ContractCallAuthorized(address indexed _wallet, address indexed _dapp, address indexed _contract, bytes4[] _signatures);
    event ContractCallDeauthorized(address indexed _wallet, address indexed _dapp, address indexed _contract, bytes4[] _signatures);

    function guardianStorage() external view returns (address);
    function dappStorage() external view returns (address);
    function dappRegistry() external view returns (address);
    function securityPeriod() external view returns (uint256);
    function securityWindow() external view returns (uint256);
    function isAuthorizedCall(address _wallet, address _dapp, address _to, bytes calldata _data) external view returns (bool _isAuthorized);

    function callContract(address _wallet, address _dapp, address _to, uint256 _amount, bytes calldata _data) external;
    function authorizeCall(address _wallet, address _dapp, address _contract, bytes4[] calldata _signatures) external;
    function deauthorizeCall(address _wallet, address _dapp, address _contract, bytes4[] calldata _signatures) external;
    function confirmAuthorizeCall(address _wallet, address _dapp, address _contract, bytes4[] calldata _signatures) external;
    function cancelAuthorizeCall(address _wallet, address _dapp, address _contract, bytes4[] calldata _signatures) external;
    function changeLimit(address _wallet, uint256 _newLimit) external;
    function disableLimit(address _wallet) external;
}
