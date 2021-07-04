// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

// part of TransactionManager, which is part of ArgentModule
interface ISessionManager {
    event SessionCreated(address indexed wallet, address sessionKey, uint64 expires);
    event SessionCleared(address indexed wallet, address sessionKey);
}
