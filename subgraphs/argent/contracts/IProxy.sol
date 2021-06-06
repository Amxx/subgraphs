// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IProxy {
    event Received(uint indexed value, address indexed sender, bytes data);
}
