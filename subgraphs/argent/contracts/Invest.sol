// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface Invest {
    event InvestmentAdded(address indexed _wallet, address _token, uint256 _invested, uint256 _period);
    event InvestmentRemoved(address indexed _wallet, address _token, uint256 _fraction);

    function getInvestment(address _wallet, address _token) external view returns (uint256 _tokenValue, uint256 _periodEnd);

    function addInvestment(address _wallet, address _token, uint256 _amount, uint256 _period) external returns (uint256 _invested);
    function removeInvestment(address _wallet, address _token, uint256 _fraction) external;
}
