// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./WorldFun.sol";

contract FunFactory {
    event TokenCreated(address tokenAddress, string name, string symbol, address owner);
    
    mapping(address => address[]) public creatorTokens;
    address[] public allTokens;
    
    function createToken(
        string memory name,
        string memory symbol,
        string memory desc,
        string memory imgUri
    ) external returns (address) {
        // Deploy new token
        PumpToken newToken = new PumpToken();
        
        // Store token address
        creatorTokens[msg.sender].push(address(newToken));
        allTokens.push(address(newToken));
        
        // Transfer ownership to creator
        newToken.transferOwnership(msg.sender);
        
        emit TokenCreated(address(newToken), name, symbol, msg.sender);
        
        return address(newToken);
    }
    
    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
}
