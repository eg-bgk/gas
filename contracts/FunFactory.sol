// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./WorldFun.sol";

contract FunFactory {
  event TokenCreated(
    address tokenAddress,
    string name,
    string symbol,
    address owner
  );

  mapping(address => address[]) public creatorTokens;
  address[] public allTokens;

  // Add struct for token metadata
  struct TokenMetadata {
    string name;
    string symbol;
    string description;
    string imageUri;
    address tokenAddress;
    address owner;
  }

  // Add mapping for token metadata
  mapping(address => TokenMetadata) public tokenMetadata;

  function createToken(
    string memory name,
    string memory symbol,
    string memory desc,
    string memory imgUri
  ) external returns (address) {
    // Deploy new token
    WorldFun newToken = new WorldFun(name, symbol);
    address tokenAddress = address(newToken);

    // Store token metadata
    tokenMetadata[tokenAddress] = TokenMetadata({
      name: name,
      symbol: symbol,
      description: desc,
      imageUri: imgUri,
      tokenAddress: tokenAddress,
      owner: msg.sender
    });

    // Store token address
    creatorTokens[msg.sender].push(tokenAddress);
    allTokens.push(tokenAddress);

    emit TokenCreated(tokenAddress, name, symbol, msg.sender);

    return tokenAddress;
  }

  function buyTokens(address tokenAddress, uint256 amount) external {
    WorldFun token = WorldFun(tokenAddress);
    token.buy(amount);
  }

  function sellTokens(address tokenAddress, uint256 amount) external {
    WorldFun token = WorldFun(tokenAddress);
    token.sell(amount);
  }

  function getCreatorTokens(
    address creator
  ) external view returns (address[] memory) {
    return creatorTokens[creator];
  }

  function getAllTokens() external view returns (address[] memory) {
    return allTokens;
  }

  function getTokenCount() external view returns (uint256) {
    return allTokens.length;
  }

  function getAllTokenMetadata() external view returns (TokenMetadata[] memory) {
    uint256 length = allTokens.length;
    TokenMetadata[] memory allMetadata = new TokenMetadata[](length);
    
    for (uint256 i = 0; i < length; i++) {
      allMetadata[i] = tokenMetadata[allTokens[i]];
    }
    
    return allMetadata;
  }
}
