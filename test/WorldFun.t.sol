// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {WorldFun} from "../contracts/WorldFun.sol";

contract WorldFunTest is Test {
    WorldFun public worldFun;
    address public user1;
    address public user2;
    address public user3;

    event PriceUpdate(uint256 oldPrice, uint256 newPrice, uint256 timestamp, WorldFun.PricePhase phase);
    event TokensPurchased(address indexed buyer, uint256 paymentAmount, uint256 tokenAmount, uint256 price, uint256 marketCap);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount);
    event LaunchThresholdReached(uint256 marketCap, uint256 timestamp);

    function setUp() public {
        worldFun = new WorldFun("WorldFun Token", "WFT");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.deal(user3, 100 ether);
    }

    function test_InitialState() public view {
        assertEq(worldFun.name(), "WorldFun Token");
        assertEq(worldFun.symbol(), "WFT");
        assertEq(worldFun.lastPrice(), worldFun.INITIAL_PRICE());
        assertEq(worldFun.totalSupply(), 0);
        assertEq(worldFun.MAX_BUY_AMOUNT(), worldFun.MAX_SUPPLY() / 100);
    }

    function test_PriceCalculation() public view {
        // Test initial price
        assertEq(worldFun.calculatePrice(0), worldFun.INITIAL_PRICE());
        
        // Test price at various supply levels
        uint256 tenPercentSupply = worldFun.MAX_SUPPLY() / 10;
        uint256 fiftyPercentSupply = worldFun.MAX_SUPPLY() / 2;
        uint256 ninetyPercentSupply = (worldFun.MAX_SUPPLY() * 90) / 100;

        assertTrue(worldFun.calculatePrice(tenPercentSupply) > worldFun.INITIAL_PRICE());
        assertTrue(worldFun.calculatePrice(fiftyPercentSupply) > worldFun.calculatePrice(tenPercentSupply));
        assertTrue(worldFun.calculatePrice(ninetyPercentSupply) > worldFun.calculatePrice(fiftyPercentSupply));
    }

    function test_BuyWithPaymentAmount() public {
        uint256 paymentAmount = 1 ether;
        
        vm.startPrank(user1);
        uint256 initialBalance = user1.balance;
        uint256 initialTokens = worldFun.balanceOf(user1);
        
        worldFun.buy(paymentAmount);
        
        assertTrue(worldFun.balanceOf(user1) > initialTokens);
        assertEq(worldFun.userInvested(user1), paymentAmount);
        assertEq(user1.balance, initialBalance);
        vm.stopPrank();
    }

    function test_Sell() public {
        // First buy some tokens
        uint256 buyAmount = 1 ether;
        vm.startPrank(user1);
        worldFun.buy(buyAmount);
        uint256 tokenBalance = worldFun.balanceOf(user1);
        
        // Then sell half of them
        uint256 sellAmount = tokenBalance / 2;
        worldFun.sell(sellAmount);
        
        assertEq(worldFun.balanceOf(user1), tokenBalance - sellAmount);
        assertTrue(worldFun.userWithdrawn(user1) > 0);
        vm.stopPrank();
    }

    function test_LaunchThreshold() public {
        // Calculate amount needed to reach launch threshold
        // Launch happens when marketCap = currentSupply * currentPrice >= LAUNCH_MARKET_CAP
        uint256 paymentAmount = 10 ether; // Start with a smaller amount
        
        vm.startPrank(user1);
        vm.expectEmit(false, false, false, true);
        emit LaunchThresholdReached(worldFun.LAUNCH_MARKET_CAP(), block.timestamp);
        worldFun.buy(paymentAmount);
        
        assertTrue(worldFun.isLaunched());
        assertTrue(worldFun.launchPrice() > 0);
        vm.stopPrank();
    }

    function test_PostLaunchPrice() public {
        // Use smaller amounts to avoid exceeding max supply
        vm.startPrank(user1);
        worldFun.buy(10 ether);
        
        // Verify price calculation
        uint256 currentSupply = worldFun.totalSupply();
        uint256 currentPrice = worldFun.calculatePrice(currentSupply);
        
        // Test price increases with supply
        assertTrue(worldFun.calculatePrice(currentSupply + 1000) > currentPrice);
        vm.stopPrank();
    }

    function test_MinTradeAmount() public {
        vm.startPrank(user1);
        // Buy some tokens first
        worldFun.buy(1 ether);
        
        // Try to sell below minimum
        uint256 tinyAmount = worldFun.MIN_TRADE_AMOUNT() - 1;
        vm.expectRevert("Insufficient amount");  // Update expected revert message
        worldFun.sell(tinyAmount);
        vm.stopPrank();
    }

    function test_SellAfterLaunch() public {
        // Use smaller amounts to avoid exceeding max supply
        vm.startPrank(user1);
        worldFun.buy(10 ether);
        uint256 tokenBalance = worldFun.balanceOf(user1);
        
        // Try to sell after launch
        vm.expectRevert("Use DEX after launch");
        worldFun.sell(tokenBalance / 2);
        vm.stopPrank();
    }
}
