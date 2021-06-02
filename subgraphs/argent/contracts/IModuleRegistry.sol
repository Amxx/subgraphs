pragma solidity ^0.8.0;

import "./IOwned.sol";

interface IModuleRegistry is IOwned {
  event ModuleRegistered(address indexed module, bytes32 name);
  event ModuleDeRegistered(address module);
  event UpgraderRegistered(address indexed upgrader, bytes32 name);
  event UpgraderDeRegistered(address upgrader);
}
