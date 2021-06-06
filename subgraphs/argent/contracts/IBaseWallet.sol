// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IBaseWallet {
    event AuthorisedModule(address indexed module, bool value);
    event EnabledStaticCall(address indexed module, bytes4 indexed method);
    event Invoked(address indexed module, address indexed target, uint indexed value, bytes data);
    event Received(uint indexed value, address indexed sender, bytes data);
    event OwnerChanged(address owner);

    function implementation() external view returns (address);
    function owner() external view returns (address);
    function authorised(address) external view returns (bool);
    function enabled(bytes4) external view returns (address);
    function modules() external view returns (uint256);

    function init(address _owner, address[] calldata _modules) external;
    function authoriseModule(address _module, bool _value) external;
    function enableStaticCall(address _module, bytes4 _method) external;
    function setOwner(address _newOwner) external;
    function invoke(address _target, uint _value, bytes calldata _data) external;
}
