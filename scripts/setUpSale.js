const { ethers } = require("hardhat")

async function enterRaffle() {
    const LePointRouge = await ethers.getContract("LePointRouge")
    await LePointRouge.setUpSale()
    console.log("sale set up")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })