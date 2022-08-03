const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_CONTRACT_ADDRESSES =
  "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json";
const ABI = "../nextjs-smartcontract-lottery-fcc/constants/abi.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating front end...");
    updateContractAddresses();
    updateAbi();
    console.log("Front end written!");
  }
};

async function updateAbi() {
  const raffle = await ethers.getContract("Raffle");
  fs.writeFileSync(ABI, raffle.interface.format(ethers.utils.FormatTypes.json));
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract("Raffle");
  const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_CONTRACT_ADDRESSES, "utf8"));
  const chainId = network.config.chainId.toString();

  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId].includes(raffle.address)) {
      contractAddresses[chainId].push(raffle.address);
    }
  } else {
    contractAddresses[chainId] = [raffle.address];
  }

  fs.writeFileSync(FRONT_END_CONTRACT_ADDRESSES, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
