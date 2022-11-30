const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../vercel-hostings/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../vercel-hostings/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating Front End..")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end updated")
    }
}
async function updateAbi() {
    const LePointRouge = await ethers.getContract("LePointRouge")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        LePointRouge.interface.format(ethers.utils.FormatTypes.json)
    )
}
async function updateContractAddresses() {
    const LePointRouge = await ethers.getContract("LePointRouge")
    const chainId = network.config.chainId.toString()
    const ContractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in ContractAddress) {
        if (!ContractAddress[chainId].includes(LePointRouge.address)) {
            ContractAddress[chainId].push(LePointRouge.address)
        }
    }
    {
        ContractAddress[chainId] = [LePointRouge.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(ContractAddress))
}

module.exports.tags = ["all", "frontend"]
