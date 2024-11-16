// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WorldFun is ERC20 {
  event PriceUpdate(uint256 oldPrice, uint256 newPrice);
  event TokensPurchased(
    address indexed buyer,
    uint256 paymentAmount,
    uint256 tokenAmount
  );
  event TokensSold(
    address indexed seller,
    uint256 tokenAmount,
    uint256 ethAmount
  );
  event LaunchThresholdReached(uint256 marketCap, uint256 timestamp);

  uint256 public constant INITIAL_PRICE = 0.000001 ether;
  uint256 public constant MAX_SUPPLY = 1000000 * 10 ** 18; // 1 million tokens
  uint256 public constant MAX_BUY_AMOUNT = MAX_SUPPLY / 100; // 1% of total supply
  uint256 public constant MIN_TRADE_AMOUNT = 1000; // 0.001 tokens with 18 decimals
  uint256 public constant LAUNCH_MARKET_CAP = 1000000 ether; // 1 million ETH

  uint256 public lastPrice;
  bool public launchThresholdReached;
  bool public isLaunched;
  uint256 public launchPrice;

  constructor(
    string memory name,
    string memory symbol
  ) ERC20(name, symbol) {
    lastPrice = INITIAL_PRICE;
  }

  function calculatePrice(uint256 supply) public view returns (uint256) {
    if (isLaunched) {
      return launchPrice;
    }
    return _calculateBasePrice(supply);
  }

  function _calculateBasePrice(uint256 supply) internal pure returns (uint256) {
    // Linear-quadratic bonding curve: P = P0 * (1 + kx + mx²)
    // where x is the supply ratio (0 to 1)
    uint256 supplyRatio = (supply * 1e18) / MAX_SUPPLY;
    uint256 linearIncrease = supplyRatio;
    uint256 quadraticIncrease = (supplyRatio * supplyRatio * 2) / 1e18;
    uint256 totalIncrease = linearIncrease + quadraticIncrease;
    return (INITIAL_PRICE * (1e18 + totalIncrease)) / 1e18;
  }

  function buy() external payable {
    require(msg.value > 0, "Must send ETH");
    require(!isLaunched, "Use DEX after launch");

    uint256 currentSupply = totalSupply();
    uint256 price = calculatePrice(currentSupply);
    uint256 tokenAmount = (msg.value * 1e18) / price;

    require(tokenAmount <= MAX_BUY_AMOUNT, "Exceeds max buy amount");
    require(currentSupply + tokenAmount <= MAX_SUPPLY, "Exceeds max supply");

    uint256 oldPrice = lastPrice;
    lastPrice = calculatePrice(currentSupply + tokenAmount);
    emit PriceUpdate(oldPrice, lastPrice);

    _mint(msg.sender, tokenAmount);

    uint256 marketCap = (currentSupply + tokenAmount) * lastPrice / 1e18;
    if (!isLaunched && marketCap >= LAUNCH_MARKET_CAP) {
        isLaunched = true;
        launchPrice = lastPrice;
        emit LaunchThresholdReached(marketCap, block.timestamp);
    }

    emit TokensPurchased(msg.sender, msg.value, tokenAmount);
  }

  function sell(uint256 tokenAmount) external {
    require(!isLaunched, "Use DEX after launch");
    require(tokenAmount >= MIN_TRADE_AMOUNT, "Amount too small");
    require(tokenAmount <= balanceOf(msg.sender), "Insufficient balance");
    
    uint256 currentSupply = totalSupply();
    require(currentSupply > tokenAmount, "Cannot sell all tokens");
    
    uint256 price = calculatePrice(currentSupply - tokenAmount);
    uint256 ethAmount = (tokenAmount * price) / 1e18;
    
    uint256 oldPrice = lastPrice;
    lastPrice = price;
    emit PriceUpdate(oldPrice, lastPrice);

    _burn(msg.sender, tokenAmount);
    
    (bool success, ) = msg.sender.call{value: ethAmount}("");
    require(success, "ETH transfer failed");

    emit TokensSold(msg.sender, tokenAmount, ethAmount);
  }

  receive() external payable {}
}
