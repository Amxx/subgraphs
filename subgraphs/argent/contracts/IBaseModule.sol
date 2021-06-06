// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IModule.sol";

interface IBaseModule is IModule {
    event ModuleCreated(bytes32 name);
    event ModuleInitialised(address wallet);
}
