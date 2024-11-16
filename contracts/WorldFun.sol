// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WorldFun is ERC20 {
  event PriceUpdate(
    uint256 oldPrice,
    uint256 newPrice,
    uint256 timestamp,
    PricePhase phase
  );
  event TokensPurchased(
    address indexed buyer,
    uint256 paymentAmount,
    uint256 tokenAmount,
    uint256 price,
    uint256 marketCap
  );
  event TokensSold(
    address indexed seller,
    uint256 tokenAmount,
    uint256 ethAmount
  );
  event LaunchThresholdReached(uint256 marketCap, uint256 timestamp);

  uint256 public constant INITIAL_PRICE = 0.00001 ether;
  uint256 public constant MAX_SUPPLY = 100 * 10 ** 18; // 100k tokens
  uint256 public constant LAUNCH_MARKET_CAP = 10000000 ether; // 1 million ETH

  uint256 public lastPrice;
  bool public launchThresholdReached;
  bool public isLaunched;
  uint256 public launchPrice;

  // Add new mapping to track user balances
  mapping(address => uint256) public userInvested;
  mapping(address => uint256) public userWithdrawn;

  enum PricePhase { INITIAL, GROWTH, ACCELERATION, LAUNCHED }
  
  struct MarketMetrics {
    uint256 lastUpdateBlock;
    uint256 totalVolume;
    uint256 peakPrice;
    PricePhase currentPhase;
  }

  uint256 private constant PHASE_THRESHOLD_1 = MAX_SUPPLY / 4;
  uint256 private constant PHASE_THRESHOLD_2 = MAX_SUPPLY / 2;
  uint256 private constant PRICE_DECIMALS = 18;
  
  MarketMetrics public metrics;
  mapping(address => uint256) public lastTradeBlock;
  mapping(PricePhase => uint256) public phaseThresholds;

  constructor(
    string memory name,
    string memory symbol
  ) ERC20(name, symbol) {
    lastPrice = INITIAL_PRICE;
    isLaunched = false;
    phaseThresholds[PricePhase.INITIAL] = PHASE_THRESHOLD_1;
    phaseThresholds[PricePhase.GROWTH] = PHASE_THRESHOLD_2;
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

  function buy(uint256 paymentAmount) external {
    uint256 currentSupply = totalSupply();
    uint256 price = calculatePrice(currentSupply);
    uint256 tokenAmount = (paymentAmount * 1e18) / price;

    uint256 oldPrice = lastPrice;
    lastPrice = calculatePrice(currentSupply + tokenAmount);
    emit PriceUpdate(oldPrice, lastPrice, block.timestamp, PricePhase.INITIAL);

    _mint(msg.sender, tokenAmount);
    userInvested[msg.sender] += paymentAmount;

    uint256 marketCap = (currentSupply + tokenAmount) * lastPrice / 1e18;
    if (!isLaunched && marketCap >= LAUNCH_MARKET_CAP) {
        isLaunched = true;
        launchPrice = lastPrice;
        emit LaunchThresholdReached(marketCap, block.timestamp);
    }

    emit TokensPurchased(msg.sender, paymentAmount, tokenAmount, price, marketCap);
  }

  function sell(uint256 tokenAmount) external {
    require(!isLaunched, "Use DEX after launch");
    
    uint256 currentSupply = totalSupply();
    uint256 currentPrice = calculatePrice(currentSupply);
    uint256 ethAmount = (tokenAmount * currentPrice) / 1e18;
    
    lastPrice = calculatePrice(currentSupply - tokenAmount);
    emit PriceUpdate(currentPrice, lastPrice, block.timestamp, PricePhase.INITIAL);

    _burn(msg.sender, tokenAmount);
    userWithdrawn[msg.sender] += ethAmount;

    emit TokensSold(msg.sender, tokenAmount, ethAmount);
  }
}
