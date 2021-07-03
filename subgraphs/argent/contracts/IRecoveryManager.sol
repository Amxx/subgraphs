// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";

interface IRecoveryManager is IBaseModule, IRelayerModule {
    event RecoveryExecuted(address indexed wallet, address indexed recovery, uint64 executeAfter);
    event RecoveryFinalized(address indexed wallet, address indexed recovery);
    event RecoveryCanceled(address indexed wallet, address indexed recovery);
    event OwnershipTransfered(address indexed wallet, address indexed newOwner);

    function recoveryPeriod() external view returns (uint256);
    function lockPeriod() external view returns (uint256);
    function securityPeriod() external view returns (uint256);
    function securityWindow() external view returns (uint256);
    function guardianStorage() external view returns (address);
    function getRecovery(address _wallet) external view returns(address _address, uint64 _executeAfter, uint32 _guardianCount);
    function getRequiredSignatures(address _wallet, bytes calldata _data) external view returns (uint256);

    function executeRecovery(address _wallet, address _recovery) external;
    function finalizeRecovery(address _wallet) external;
    function cancelRecovery(address _wallet) external;
    function transferOwnership(address _wallet, address _newOwner) external;
}
