// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

// ==================== External Imports ====================

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VoteToken
 * @author Danile Liu
 * @custom:contact 139250065@qq.com
 */
contract VoteToken is ERC20, ERC20Permit, Ownable {
    // ==================== Custom errors ====================

    error Unauthorized(address account);

    // ==================== Constructor function ====================

    constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name) {}

    // ==================== External functions ====================

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) external {
        if (msg.sender == account || msg.sender == owner()) {
            _burn(account, amount);
        } else {
            revert Unauthorized(msg.sender);
        }
    }
}
