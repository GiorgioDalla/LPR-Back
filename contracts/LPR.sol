// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

/**
 * @title Le Point Rouge NFT
 * @author Giorgio Dalla Giovanna
 * @notice This NFT contract uses a ECDSA signatures verification process, enabling only those who are allowed to mint
 * @dev All function calls are currently implemented without side effects
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract LePointRougeTesting is Ownable, ERC721Enumerable, ReentrancyGuard {
    /*Errors*/
    error LePointRouge__MintingNotStarted();
    error LePointRouge__MintLimExceeded();
    error LePointRouge__SignerAddressMismatch();
    error LePointRouge__SoldOut();
    error LePointRouge__MintGiftExceeded();
    error LePointRouge__DoesNotExist();

    /* Library functions */
    using ECDSA for bytes32;
    using Counters for Counters.Counter;
    using Strings for uint256;

    /* Enums */
    enum Steps {
        Before,
        Sale,
        SoldOut,
        Reveal
    }

    /* State variables */

    // using the counter librabry struct through s_nftIdCounter
    Counters.Counter private s_nftIdCounter;
// this is the contract I used for test, because of the ECDSA signatures I reduced the MAX_SUPPLY to 3 to make things more manageable
    uint256 private constant MAX_SUPPLY = 3;
    uint256 private constant MAX_SALE = 101;
    uint256 private constant MAX_GIFT = 10;

    string public s_baseURI;
    string public s_notRevealedURI;
    string public baseExtension = ".json";
    bool public revealed = false;

    Steps public sellingStep;

    //Owner of the smart contract put immutable or not ?
    address private _owner;
    address private _signerAddress;

    mapping(address => uint256) public s_nftsPerWallet;

    /* Functions */
    constructor(
        string memory _theBaseURI,
        string memory _notRevealedURI,
        address signerAddress_
    ) ERC721("Le Point Rouge", "LPR") {
        _signerAddress = signerAddress_;
        s_nftIdCounter.increment();
        transferOwnership(msg.sender);
        sellingStep = Steps.Before;
        s_baseURI = _theBaseURI;
        s_notRevealedURI = _notRevealedURI;
    }

    function saleMint(address _account, bytes calldata signature) external nonReentrant {
        if (sellingStep == Steps.Before) {
            revert LePointRouge__MintingNotStarted();
        }

        if (s_nftsPerWallet[msg.sender] + 1 > 1) {
            revert LePointRouge__MintLimExceeded();
        }
        if (
            _signerAddress !=
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    bytes32(uint256(uint160(msg.sender)))
                )
            ).recover(signature)
        ) {
            revert LePointRouge__SignerAddressMismatch();
        }

        if (totalSupply() + 1 > MAX_SUPPLY) {
            revert LePointRouge__SoldOut();
        }
        if (sellingStep == Steps.SoldOut) {
            revert LePointRouge__SoldOut();
        }
        s_nftsPerWallet[_account]++;
        _safeMint(_account, s_nftIdCounter.current());
        (s_nftIdCounter).increment();
        if (totalSupply() == MAX_SUPPLY) {
            sellingStep = Steps.SoldOut;
        }
    }

    function gift(address _account) external onlyOwner {
        if (totalSupply() + 1 > MAX_SUPPLY) {
            revert LePointRouge__MintGiftExceeded();
        }
        _safeMint(_account, (s_nftIdCounter).current());
        (s_nftIdCounter).increment();
    }

    function setUpSale() external onlyOwner {
        sellingStep = Steps.Sale;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    function setBaseUri(string memory _newBaseURI) external onlyOwner {
        s_baseURI = _newBaseURI;
    }

    function setNotRevealURI(string memory _notRevealedURI) external onlyOwner {
        s_notRevealedURI = _notRevealedURI;
    }

    /* View Funtions */

    /*ECDSA*/
    function testBytesReturn() external view returns (bytes32) {
        return bytes32(uint256(uint160(msg.sender)));
    }

    function testSignerRecovery(bytes calldata signature) external view returns (address) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    bytes32(uint256(uint160(msg.sender)))
                )
            ).recover(signature);
    }

    /*URI*/
    function _baseURI() internal view virtual override returns (string memory) {
        return s_baseURI;
    }

    function tokenURI(uint256 _nftId) public view override(ERC721) returns (string memory) {
        if (!_exists(_nftId)) {
            revert LePointRouge__DoesNotExist();
        }
        if (revealed == false) {
            return s_notRevealedURI;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(abi.encodePacked(currentBaseURI, _nftId.toString(), baseExtension))
                : "";
    }
}
