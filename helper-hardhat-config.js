const arg1 = "ipfs://QmYFtTYXbhxAEDYLBzaFjgzKoxz5BEv9tMGkTDGEoB3jEQ/"
const arg2 = "ipfs://QmaYqxqLetSUDmc28MCv5gXPLKRHegJaZNXJjTNFtxfQkd/hidden.json"
const arg3 = "0x1DC85482861F3c81Ff641e269b6C3056Cf4D738a"

const addressTest = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const signatureTest =
    "0xf928250a218ce40664e91b7a15d71bbe2e2e7e909006e5df7e75a39fcb8caa166b08b09668e2070752d27329a656582a70839de1b846494a9b186a6623aae4ba1b"
const addressTest2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const signatureTest2 =
    "0xec6fe39b5edb5700b6f62aed00d7435d3c0e4924089f77cc39dec63b40724741191969b63727c8c0e2874525402cc00aa5609b94e976b56110e25038c6c2a5a41b"
const addressTest3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
const signatureTest3 =
    "0x19ba45ee8546f6bf5305b87cc64688d091f12d8105604e376456404a3330220049c330b750aeb571ae22f1811c5cbc72760b74aa3c7e5d5d97182861e25d2ffc1b"
const addressTest4 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
const signatureTest4 =
    "0x9c21e5219197dddb7ca24617ddba012b2b715af5997883643030a95a95803efc0a5a19382a47dec18d87446cfb2ec80ce690e3e355dbab74f7cc87191a0a8c0c1b"
arguments = [arg1, arg2, arg3]

const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "don't need it yet",
    },
}
const developmentChains = ["hardhat", "localhost"]
module.exports = {
    networkConfig,
    arguments,
    developmentChains,
    arg1,
    arg2,
    arg3,
    addressTest,
    signatureTest,
    signatureTest2,
    addressTest2,
    addressTest3,
    signatureTest3,
    addressTest4,
    signatureTest4,
}
