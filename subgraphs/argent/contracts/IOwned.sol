// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IOwned {
    event OwnerChanged(address indexed newOwner);

    function owner() external view returns (address);

    function changeOwner(address _newOwner) external;
}
