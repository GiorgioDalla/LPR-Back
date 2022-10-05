// function deployFunc() {
//     console.log("Hi!")

// }

// module.exports.default = deployFunc
// const {networkConfig} = require ("../") don't need it either
const { network } = require("hardhat")
const { arguments, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const lePointRouge = await deploy("LePointRouge", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        // verify
        await verify(lePointRouge.address, arguments)
    }
    log(`deployer is ${deployer}`)
    log("------------------------------------------")
}
module.exports.tags = ["all", "LePointRougeNFT"]
