// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IENSConsumer {
    function ADDR_REVERSE_NODE() external view returns (bytes32);
    function ensRegistry() external view returns (address);
    function resolveEns(bytes32 _node) external view returns (address);
    function getENSRegistry() external view returns (address);
    function getENSReverseRegistrar() external view returns (address);
}
