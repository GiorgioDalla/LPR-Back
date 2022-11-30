// const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts } = require("hardhat")
const {
    arg1,
    arg2,
    arg3,
    developmentChains,
    signatureTest,
    addressTest,
    addressTest2,
    signatureTest2,
    addressTest3,
    signatureTest3,
    addressTest4,
    signatureTest4,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LePointRouge", function () {
          let LePointRouge, deployer, addr1, addr2, addr3, addr4
          beforeEach(async function () {
              ;[addr1, addr2, addr3, addr4] = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all", "LePointRougeNFT"])
              LePointRouge = await ethers.getContract("LePointRougeTesting", deployer)
          })

          describe("constructor", function () {
              it(" sets the right URI", async function () {
                  const baseURI = await LePointRouge.s_baseURI()
                  expect(arg1).to.equal(baseURI)
              })
              it(" set's the right Not revealed URI", async function () {
                  const notRevealed = await LePointRouge.s_notRevealedURI()
                  expect(arg2).to.equal(notRevealed)
              })
              it("sets the right name and symbol", async () => {
                  const name = await LePointRouge.name()
                  const symbol = await LePointRouge.symbol()
                  expect("Le Point Rouge").to.equal(name)
                  expect("LPR").to.equal(symbol)
              })
          })

          describe("gift", function () {
              it("only allows the owner to gift an NFT", async function () {
                  await LePointRouge.gift(arg3)
                  assert.equal(await LePointRouge.tokenURI(1), arg2)
              })
              it("doesn't allow others to gift", async function () {
                  await expect(LePointRouge.connect(addr2).gift(addr1.address)).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })

          describe("mint", function () {
              it("cannot mint if Sale hasn't started", async function () {
                  await expect(
                      LePointRouge.saleMint(addressTest, signatureTest)
                  ).to.be.revertedWith("LePointRouge__MintingNotStarted")
              })

              it("mints a token, starting with ID 1", async function () {
                  await LePointRouge.setUpSale()
                  const txResponse = await LePointRouge.saleMint(addressTest, signatureTest)
                  const tokenURI = await LePointRouge.tokenURI(1)
                  assert.equal(tokenURI.toString(), arg2)
              })
              it("mints 2 tokens, token 2 exists", async function () {
                  await LePointRouge.setUpSale()
                  const txResponse = await LePointRouge.saleMint(addressTest, signatureTest)
                  const txResponse2 = await LePointRouge.connect(addr2).saleMint(
                      addressTest2,
                      signatureTest2
                  )
                  txResponse
                  txResponse2
                  const tokenURI = await LePointRouge.tokenURI(2)
                  assert.equal(tokenURI.toString(), arg2)
              })
              it("cannot mint two tokens, async function", async function () {
                  await LePointRouge.setUpSale()
                  await LePointRouge.saleMint(addressTest, signatureTest)
                  await expect(
                      LePointRouge.saleMint(addressTest, signatureTest)
                  ).to.be.revertedWith("LePointRouge__MintLimExceeded()")
              })

              it("cannot mint more than MAX_SUPPLY", async function () {
                  await LePointRouge.setUpSale()
                  await LePointRouge.saleMint(addressTest, signatureTest)
                  await LePointRouge.connect(addr2).saleMint(addressTest2, signatureTest2)
                  await LePointRouge.connect(addr3).saleMint(addressTest3, signatureTest3)
                  await expect(
                      LePointRouge.connect(addr4).saleMint(addressTest4, signatureTest4)
                  ).to.be.revertedWith("LePointRouge__SoldOut")
              })
          })

          describe("tokenURI", function () {
              it("doesn't find unexisting tokens", async function () {
                  await expect(LePointRouge.tokenURI(3)).to.be.revertedWith(
                      "LePointRouge__DoesNotExist"
                  )
              })
          })
          describe("reveals the NFT's", function () {
              it("reveal's the NFT's", async function () {
                  const expectedValue = true
                  await LePointRouge.reveal()
                  expect(await LePointRouge.revealed()).to.equal(expectedValue)
              })
          })
          describe("setBaseUri", function () {
              it("sets the correct base Uri", async function () {
                  const expectedURI = "ipfs://example/"
                  await LePointRouge.setBaseUri(expectedURI)
                  await LePointRouge.reveal()
                  assert.equal(await LePointRouge.s_baseURI(), expectedURI)
              })
              it("only the owner can set it", async function () {
                  const expectedURI = "ipfs://example/"
                  await expect(
                      LePointRouge.connect(addr2).setBaseUri(expectedURI)
                  ).to.be.revertedWith("Ownable: caller is not the owner")
              })
          })
          describe("setNotRevealedUri", function () {
              it("sets the correct NotRevealedUri", async function () {
                  const expectedURI = "ipfs://example/hidden.json"
                  await LePointRouge.setNotRevealURI(expectedURI)
                  assert.equal(await LePointRouge.s_notRevealedURI(), expectedURI)
              })
          })
          describe("setUpSale", function () {
              it("cannot mint if no setUpSale", async function () {
                  await expect(
                      LePointRouge.saleMint(addressTest, signatureTest)
                  ).to.be.revertedWith("LePointRouge__MintingNotStarted")
              })
          })
      })
