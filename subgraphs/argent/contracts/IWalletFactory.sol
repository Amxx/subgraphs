pragma solidity ^0.8.0;

import "./IOwned.sol";
import "./IManaged.sol";

interface IWalletFactory is IOwned, IManaged {
    event ModuleRegistryChanged(address addr);
    event WalletImplementationChanged(address addr);
    event ENSManagerChanged(address addr);
    event ENSResolverChanged(address addr);
    event WalletCreated(address indexed wallet, address indexed owner);
    event WalletCreated(address indexed wallet, address indexed owner, address indexed guardian, address refundToken, uint256 refundAmount);
    event RefundAddressChanged(address addr);
}
