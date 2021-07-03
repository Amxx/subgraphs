// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";

interface INftTransfer is IBaseModule, IRelayerModule {
    event NonFungibleTransfer(address indexed wallet, address indexed nftContract, uint256 indexed tokenId, address to, bytes data);

    function guardianStorage() external view returns (address);
    function ckAddress() external view returns (address);

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
    function transferNFT(address _wallet, address _nftContract, address _to, uint256 _tokenId, bool _safe, bytes calldata _data) external;
}
