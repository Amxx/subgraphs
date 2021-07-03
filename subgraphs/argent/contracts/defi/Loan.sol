// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface Loan {
    event LoanOpened(address indexed wallet, bytes32 indexed loanId, address collateral, uint256 collateralAmount, address debtToken, uint256 debtAmount);
    event LoanClosed(address indexed wallet, bytes32 indexed loanId);
    event CollateralAdded(address indexed wallet, bytes32 indexed loanId, address collateral, uint256 collateralAmount);
    event CollateralRemoved(address indexed wallet, bytes32 indexed loanId, address collateral, uint256 collateralAmount);
    event DebtAdded(address indexed wallet, bytes32 indexed loanId, address debtToken, uint256 debtAmount);
    event DebtRemoved(address indexed wallet, bytes32 indexed loanId, address debtToken, uint256 debtAmount);

    function getLoan(address wallet, bytes32 loanId) external view returns (uint8 status, uint256 ethValue);

    function openLoan(address wallet, address collateral, uint256 collateralAmount, address debtToken, uint256 debtAmount) external returns (bytes32 loanId);
    function closeLoan(address wallet, bytes32 loanId) external;
    function addCollateral(address wallet, bytes32 loanId, address collateral, uint256 collateralAmount) external;
    function removeCollateral(address wallet, bytes32 loanId, address collateral, uint256 collateralAmount) external;
    function addDebt(address wallet, bytes32 loanId, address debtToken, uint256 debtAmount) external;
    function removeDebt(address wallet, bytes32 loanId, address debtToken, uint256 debtAmount) external;
}
