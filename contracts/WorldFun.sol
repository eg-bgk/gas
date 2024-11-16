// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract PumpToken is ERC20, Ownable {
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    
    uint256 public constant INITIAL_PRICE = 0.000001 ether;
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant LIQUIDITY_THRESHOLD = 10 ether; // 10 ETH in market cap
    
    bool public liquidityAdded;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory desc,
        string memory imgUri
    ) ERC20(name, symbol) Ownable(msg.sender) {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D // Uniswap V2 Router
        );
        uniswapV2Router = _uniswapV2Router;
    }
    
    function calculatePrice(uint256 supply) public pure returns (uint256) {
        // Quadratic bonding curve: price = initial_price * (1 + supply^2/max_supply^2)
        uint256 supplyRatio = (supply * 1e18) / MAX_SUPPLY;
        uint256 priceIncrease = (supplyRatio * supplyRatio) / 1e18;
        return INITIAL_PRICE * (1e18 + priceIncrease) / 1e18;
    }
    
    function buy() external payable {
        require(msg.value > 0, "Must send ETH");
        
        uint256 currentSupply = totalSupply();
        uint256 price = calculatePrice(currentSupply);
        uint256 tokenAmount = (msg.value * 1e18) / price;
        
        require(currentSupply + tokenAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(msg.sender, tokenAmount);
        
        uint256 marketCap = currentSupply * price / 1e18;
        
        if (!liquidityAdded && marketCap >= LIQUIDITY_THRESHOLD) {
            addLiquidity();
        }
    }
    
    function addLiquidity() internal {
        liquidityAdded = true;
        
        uint256 tokenAmount = totalSupply() / 10; // 10% of supply
        uint256 ethAmount = address(this).balance / 2; // 50% of ETH balance
        
        _mint(address(this), tokenAmount);
        approve(address(uniswapV2Router), tokenAmount);
        
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }
    
    receive() external payable {}
}