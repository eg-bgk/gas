// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {WorldFun} from "../contracts/WorldFun.sol";

contract WorldFunTest is Test {
    WorldFun public worldFun;
    address public user1;
    address public user2;
    address public user3;

    event PriceUpdate(uint256 oldPrice, uint256 newPrice);
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);

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

    function test_BuyZeroAmount() public {
        vm.startPrank(user1);
        vm.expectRevert("Must send ETH");
        worldFun.buy{value: 0}();
        vm.stopPrank();
    }

    function test_MultiplePurchases() public {
        uint256 buyAmount = 0.001 ether;
        
        // First purchase
        vm.startPrank(user1);
        uint256 initialBalance = address(worldFun).balance;
        uint256 initialTokens = worldFun.balanceOf(user1);
        
        worldFun.buy{value: buyAmount}();
        
        uint256 firstPurchaseTokens = worldFun.balanceOf(user1) - initialTokens;
        assertEq(address(worldFun).balance, initialBalance + buyAmount);
        vm.stopPrank();

        // Second purchase (should get fewer tokens for same ETH due to price increase)
        vm.startPrank(user2);
        worldFun.buy{value: buyAmount}();
        uint256 secondPurchaseTokens = worldFun.balanceOf(user2);
        assertTrue(secondPurchaseTokens < firstPurchaseTokens);
        vm.stopPrank();
    }

    function test_EventEmission() public {
        uint256 buyAmount = 0.001 ether;
        
        vm.startPrank(user1);
        vm.expectEmit(true, false, false, false);
        emit TokensPurchased(user1, buyAmount, 0); // We don't check the exact token amount
        worldFun.buy{value: buyAmount}();
        vm.stopPrank();
    }

    function testFuzz_Buy(uint256 buyAmount) public {
        buyAmount = bound(buyAmount, 0.0001 ether, 0.001 ether);
        
        vm.startPrank(user1);
        uint256 initialBalance = user1.balance;
        uint256 initialTokens = worldFun.balanceOf(user1);
        
        worldFun.buy{value: buyAmount}();
        
        assertTrue(worldFun.balanceOf(user1) > initialTokens);
        assertEq(user1.balance, initialBalance - buyAmount);
        assertEq(address(worldFun).balance, buyAmount);
        
        vm.stopPrank();
    }

    function test_PriceIncrease() public {
        uint256 buyAmount = 0.001 ether;
        uint256 previousPrice = worldFun.calculatePrice(0);
        
        for(uint i = 0; i < 5; i++) {
            vm.startPrank(user1);
            worldFun.buy{value: buyAmount}();
            vm.stopPrank();
            
            uint256 currentPrice = worldFun.calculatePrice(worldFun.totalSupply());
            assertTrue(currentPrice > previousPrice);
            previousPrice = currentPrice;
        }
    }
}
