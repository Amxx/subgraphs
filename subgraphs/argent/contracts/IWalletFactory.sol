// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IOwned.sol";
import "./IManaged.sol";
import "./IENSConsumer.sol";

interface IWalletFactory is IOwned, IManaged, IENSConsumer {
    event ModuleRegistryChanged(address addr);
    event WalletImplementationChanged(address addr);
    event ENSManagerChanged(address addr);
    event ENSResolverChanged(address addr);
    event WalletCreated(address indexed wallet, address indexed owner);
    event WalletCreated(address indexed wallet, address indexed owner, address indexed guardian);
    event WalletCreated(address indexed wallet, address indexed owner, address indexed guardian, address refundToken, uint256 refundAmount);
    event RefundAddressChanged(address addr);

    function moduleRegistry() external view returns (address);
    function walletImplementation() external view returns (address);
    function ensManager() external view returns (address);
    function ensResolver() external view returns (address);
    function guardianStorage() external view returns (address);
    function refundAddress() external view returns (address);

    function createWallet(
        address _owner,
        address[] calldata _modules,
        string calldata _label)
    external;

    function createCounterfactualWallet(
        address _owner,
        address _versionManager,
        address _guardian,
        bytes32 _salt,
        uint256 _version,
        uint256 _refundAmount,
        address _refundToken,
        bytes calldata _ownerSignature)
    external returns (address _wallet);

    function getAddressForCounterfactualWallet(
        address _owner,
        address _versionManager,
        address _guardian,
        bytes32 _salt,
        uint256 _version)
    external view returns (address _wallet);

    function changeModuleRegistry(address _moduleRegistry) external;
    function changeWalletImplementation(address _walletImplementation) external;
    function changeENSManager(address _ensManager) external;
    function changeENSResolver(address _ensResolver) external;
    function init(address _wallet) external;
}
