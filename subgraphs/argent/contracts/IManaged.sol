// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IOwned.sol";

interface IManaged is IOwned {
    event ManagerAdded(address indexed manager);
    event ManagerRevoked(address indexed manager);

    function managers(address) external view returns (bool);

    function addManager(address _manager) external;
    function revokeManager(address _manager) external;
}
