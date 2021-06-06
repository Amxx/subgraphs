// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";

interface ILockManager is IBaseModule, IRelayerModule {
    event Locked(address indexed wallet, uint64 releaseAfter);
    event Unlocked(address indexed wallet);

    function NAME() external view returns (string memory);
    function guardianStorage() external view returns (address);
    function lockPeriod() external view returns (uint256);
    function getLock(address _wallet) external view returns(uint64 _releaseAfter);
    function isLocked(address _wallet) external view returns (bool _isLocked);

    function lock(address _wallet) external;
    function unlock(address _wallet) external;
}
