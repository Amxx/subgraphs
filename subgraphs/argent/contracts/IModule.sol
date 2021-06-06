// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IModule {
    function init(address _wallet) external;
    function addModule(address _wallet, address _module) external;
    function recoverToken(address _token) external;
}
