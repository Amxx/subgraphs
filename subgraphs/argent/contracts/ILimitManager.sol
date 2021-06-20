// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";

interface ILimitManager is IBaseModule {
    event LimitChanged(address indexed wallet, uint256 indexed newLimit, uint64 indexed startAfter);

    function defaultLimit() external view returns(uint256);
    function getCurrentLimit(address _wallet) external view returns (uint256 _currentLimit);
    function isLimitDisabled(address _wallet) external view returns (bool _limitDisabled);
    function getPendingLimit(address _wallet) external view returns (uint256 _pendingLimit, uint64 _changeAfter);
    function getDailyUnspent(address _wallet) external view returns (uint256 _unspent, uint64 _periodEnd);
}
