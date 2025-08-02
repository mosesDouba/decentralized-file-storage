// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FileRegistry {
    // Structure to store file metadata including three CIDs (IPFS hashes), owner, and timestamp
    struct FileRecord {
        string fileName;
        string cid1;
        string cid2;
        string cid3;
        address owner;
        uint256 timestamp;
    }

    // Dynamic array to hold all file records
    FileRecord[] public files;

    // Event emitted when a new file is uploaded, includes file ID, owner address, filename, CIDs, and timestamp
    event FileUploaded(
        uint256 indexed fileId,
        address indexed owner,
        string fileName,
        string cid1,
        string cid2,
        string cid3,
        uint256 timestamp
    );

    // ✅ The function is now payable and verifies that the payment is exactly 0.01 ETH
    function storeFile(
        string memory fileName,
        string memory cid1,
        string memory cid2,
        string memory cid3
    ) public payable {
        // Require the sender to pay exactly 0.01 ETH
        require(msg.value == 0.01 ether, "Must pay exactly 0.01 ETH");

        // Add new file record to the files array
        files.push(FileRecord({
            fileName: fileName,
            cid1: cid1,
            cid2: cid2,
            cid3: cid3,
            owner: msg.sender,
            timestamp: block.timestamp
        }));

        // Emit event for the new file upload
        emit FileUploaded(
            files.length - 1,
            msg.sender,
            fileName,
            cid1,
            cid2,
            cid3,
            block.timestamp
        );
    }

    // Get details of a single file by its index
    function getFile(uint256 index) public view returns (
        string memory fileName,
        string memory cid1,
        string memory cid2,
        string memory cid3,
        address owner,
        uint256 timestamp
    ) {
        // Ensure index is valid
        require(index < files.length, "Invalid file index");
        FileRecord storage record = files[index];
        return (
            record.fileName,
            record.cid1,
            record.cid2,
            record.cid3,
            record.owner,
            record.timestamp
        );
    }

    // Get the total number of stored files
    function getFilesCount() public view returns (uint256) {
        return files.length;
    }

    // Get all files' details as arrays (for batch fetching)
    function getAllFiles() public view returns (
        string[] memory fileNames,
        string[] memory cid1s,
        string[] memory cid2s,
        string[] memory cid3s,
        address[] memory owners,
        uint256[] memory timestamps
    ) {
        uint256 count = files.length;

        // Initialize arrays to hold all file metadata
        fileNames = new string[](count);
        cid1s = new string[](count);
        cid2s = new string[](count);
        cid3s = new string[](count);
        owners = new address[](count);
        timestamps = new uint256[](count);

        // Populate arrays with data from each file record
        for (uint256 i = 0; i < count; i++) {
            FileRecord storage record = files[i];
            fileNames[i] = record.fileName;
            cid1s[i] = record.cid1;
            cid2s[i] = record.cid2;
            cid3s[i] = record.cid3;
            owners[i] = record.owner;
            timestamps[i] = record.timestamp;
        }
    }
}
