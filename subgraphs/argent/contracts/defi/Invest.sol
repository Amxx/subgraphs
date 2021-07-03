// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface Invest {
    event InvestmentAdded(address indexed wallet, address token, uint256 invested, uint256 period);
    event InvestmentRemoved(address indexed wallet, address token, uint256 fraction);

    function getInvestment(address wallet, address token) external view returns (uint256 tokenValue, uint256 periodEnd);

    function addInvestment(address wallet, address token, uint256 amount, uint256 period) external returns (uint256 invested);
    function removeInvestment(address wallet, address token, uint256 fraction) external;
}
