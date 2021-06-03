pragma solidity ^0.8.0;

import "./IOwned.sol";

interface IManaged is IOwned {
    event ManagerAdded(address indexed _manager);
    event ManagerRevoked(address indexed _manager);
}
