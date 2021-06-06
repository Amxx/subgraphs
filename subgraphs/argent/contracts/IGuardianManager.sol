// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";

interface IGuardianManager is IBaseModule, IRelayerModule {
    event GuardianAdditionRequested(address indexed wallet, address indexed guardian, uint256 executeAfter);
    event GuardianRevokationRequested(address indexed wallet, address indexed guardian, uint256 executeAfter);
    event GuardianAdditionCancelled(address indexed wallet, address indexed guardian);
    event GuardianRevokationCancelled(address indexed wallet, address indexed guardian);
    event GuardianAdded(address indexed wallet, address indexed guardian);
    event GuardianRevoked(address indexed wallet, address indexed guardian);

    function NAME() external view returns (string memory);
    function guardianStorage() external view returns (address);
    function securityPeriod() external view returns (uint256);
    function securityWindow() external view returns (uint256);
    function isGuardian(address _wallet, address _guardian) external view returns (bool _isGuardian);
    function guardianCount(address _wallet) external view returns (uint256 _count);
    function getGuardians(address _wallet) external view returns (address[] memory _guardians);

    function addGuardian(address _wallet, address _guardian) external;
    function confirmGuardianAddition(address _wallet, address _guardian) external;
    function cancelGuardianAddition(address _wallet, address _guardian) external;
    function revokeGuardian(address _wallet, address _guardian) external;
    function confirmGuardianRevokation(address _wallet, address _guardian) external;
    function cancelGuardianRevokation(address _wallet, address _guardian) external;
}
