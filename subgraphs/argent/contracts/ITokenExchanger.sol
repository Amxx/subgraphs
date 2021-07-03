// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./IBaseModule.sol";
import "./IRelayerModule.sol";

interface ITokenExchanger is IBaseModule, IRelayerModule {
    event TokenExchanged(address indexed wallet, address srcToken, uint256 srcAmount, address destToken, uint256 destAmount);
    event TokenConverted(address indexed wallet, address srcToken, uint256 srcAmount, address destToken, uint256 destAmount);

    function kyber() external view returns (address);
    function feeCollector() external view returns (address);
    function feeRatio() external view returns (uint256);
    function guardianStorage() external view returns (address);
    function getExpectedTrade(address _srcToken, address _destToken, uint256 _srcAmount) external view returns (uint256 _destAmount, uint256 _fee, uint256 _expectedRate);

    function trade(address _wallet, address _srcToken, uint256 _srcAmount, address _destToken, uint256 _maxDestAmount, uint256 _minConversionRate) external;
}
