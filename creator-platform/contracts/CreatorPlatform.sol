// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreatorPlatform {
    struct CreatorProfile {
        string name;
        string description;
        address payable wallet;
        uint productCount;
    }

    struct DigitalProduct {
        uint id;
        string title;
        string description;
        uint price;
        bool isAvailable;
    }

    mapping(address => CreatorProfile) public creators;
    mapping(address => mapping(uint => DigitalProduct)) private creatorProducts;

    event ProfileCreated(address indexed creator, string name);
    event ProductCreated(address indexed creator, uint productId, string title);

    modifier onlyCreator() {
        require(creators[msg.sender].wallet != address(0), "Not a registered creator");
        _;
    }

    function createProfile(string memory _name, string memory _description) external {
        require(creators[msg.sender].wallet == address(0), "Profile already exists");
        require(bytes(_name).length > 0, "Name cannot be empty");

        creators[msg.sender] = CreatorProfile({
            name: _name,
            description: _description,
            wallet: payable(msg.sender),
            productCount: 0
        });

        emit ProfileCreated(msg.sender, _name);
    }

    function addProduct(string memory _title, string memory _description, uint _price) external onlyCreator {
        CreatorProfile storage profile = creators[msg.sender];
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");

        uint productId = profile.productCount++;
        creatorProducts[msg.sender][productId] = DigitalProduct({
            id: productId,
            title: _title,
            description: _description,
            price: _price,
            isAvailable: true
        });

        emit ProductCreated(msg.sender, productId, _title);
    }

    function getProduct(address creator, uint productId) external view returns (DigitalProduct memory) {
        return creatorProducts[creator][productId];
    }

    function getProductCount(address creator) external view returns (uint) {
        return creators[creator].productCount;
    }
}
