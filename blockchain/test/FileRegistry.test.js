const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FileRegistry", function () {
  let FileRegistry, fileRegistry, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    FileRegistry = await ethers.getContractFactory("FileRegistry");
    fileRegistry = await FileRegistry.deploy(); // No .deployed()
  });

it("should deploy successfully", async function () {
expect(fileRegistry.target).to.not.be.undefined;

});

  it("should start with 0 files", async function () {
    const count = await fileRegistry.getFilesCount();
    expect(count).to.equal(0);
  });

  it("should allow storing a file with exact 0.01 ETH", async function () {
    const tx = await fileRegistry.connect(user).storeFile(
      "file1.txt", "CID1", "CID2", "CID3",
      { value: ethers.parseEther("0.01") }
    );
    await tx.wait();

    const count = await fileRegistry.getFilesCount();
    expect(count).to.equal(1);

    const file = await fileRegistry.getFile(0);
    expect(file[0]).to.equal("file1.txt");
    expect(file[1]).to.equal("CID1");
    expect(file[2]).to.equal("CID2");
    expect(file[3]).to.equal("CID3");
    expect(file[4]).to.equal(user.address);
  });

  it("should reject storing file with incorrect ETH value", async function () {
    await expect(
      fileRegistry.connect(user).storeFile(
        "file2.txt", "CID_A", "CID_B", "CID_C",
        { value: ethers.parseEther("0.005") }
      )
    ).to.be.revertedWith("Must pay exactly 0.01 ETH");
  });

  it("should return all files' metadata", async function () {
    await fileRegistry.connect(user).storeFile(
      "file1.txt", "CID1", "CID2", "CID3",
      { value: ethers.parseEther("0.01") }
    );

    await fileRegistry.connect(user).storeFile(
      "file2.txt", "CID4", "CID5", "CID6",
      { value: ethers.parseEther("0.01") }
    );

    const result = await fileRegistry.getAllFiles();

    expect(result[0].length).to.equal(2); // fileNames
    expect(result[0][0]).to.equal("file1.txt"); // fileNames[0]
    expect(result[1][1]).to.equal("CID4");       // cid1s[1]
    expect(result[4][0]).to.equal(user.address); // owners[0]
  });

  it("should revert when accessing a non-existent file", async function () {
    await expect(fileRegistry.getFile(0)).to.be.revertedWith("Invalid file index");
  });
});
