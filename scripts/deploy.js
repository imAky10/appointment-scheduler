const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("Calend3");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log("Calend3 contract deployed to:", contract.address);

  saveFrontendFiles();
}

function saveFrontendFiles() {
  const fs = require("fs");

  const abiDir = __dirname + "/../client/src/abis";

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  const artifact = artifacts.readArtifactSync("Calend3");

  fs.writeFileSync(abiDir + "/Calend3.json", JSON.stringify(artifact, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
