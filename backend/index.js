const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const { ethers } = require("ethers");
const fileRoutes = require('./routes/file.routes'); 
const { swaggerUi, specs } = require('./swagger.config');

// Setting up Express
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// ✅ Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ✅ Importing registration and login routes
const authRoutes = require("./auth/auth.routes");

const userRoutes = require('./routes/user.routes');  // Correct router file path according to your project

// ✅ Use auth routes for login and registration
app.use("/api/auth", authRoutes);

const PORT = 4000;

app.use(cors());
app.use(userRoutes);
app.use(fileRoutes); 

// Setting up temporary file upload
const upload = multer({ dest: "uploads/" });

// ✅ Smart contract setup
const contractABI = require("./abis/FileRegistry.json").abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 👈 Change if necessary

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // hardhat node
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

// ✅ IPFS node addresses
const ipfsNodes = [
  "http://localhost:5001", // ipfs1
  "http://localhost:5002", // ipfs2
  "http://localhost:5003", // ipfs3
];

// ✅ Split file into 3 parts
const splitFileIntoParts = (filePath) => {
  const content = fs.readFileSync(filePath);
  const size = Math.ceil(content.length / 3);
  const partsDir = path.join(__dirname, "tmp_parts");

  if (!fs.existsSync(partsDir)) fs.mkdirSync(partsDir);

  const partPaths = [];

  for (let i = 0; i < 3; i++) {
    const partContent = content.slice(i * size, (i + 1) * size);
    const partPath = path.join(partsDir, `part_${i + 1}`);
    fs.writeFileSync(partPath, partContent);
    partPaths.push(partPath);
  }

  return partPaths;
};

// ✅ Upload a part to a specific IPFS node
async function uploadToIpfsNode(filePath, ipfsApiUrl) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const response = await axios.post(`${ipfsApiUrl}/api/v0/add`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return response.data.Hash;
}

// Import verifyToken middleware
const { verifyToken } = require("./auth/auth.middleware");
const db = require("./models");
const File = db.File;

// ✅ Database Connection and Synchronization
(async () => {
  try {
    // First, create database if it doesn't exist
    const { Sequelize } = require('sequelize');
    const tempConnection = new Sequelize(
      '',  // No database specified
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false,
      }
    );

    // Create database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database '${process.env.DB_NAME}' ensured to exist.`);
    await tempConnection.close();

    // Now test the actual database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Synchronize the database (create tables if they don't exist)
    await db.sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('✅ Database tables have been synchronized successfully.');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Exit the process if database connection fails
  }
})();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to IPFS
 *     description: Upload a file, split it into 3 parts, and store each part on different IPFS nodes
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               isPrivate:
 *                 type: boolean
 *                 description: Whether the file should be private
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileId:
 *                   type: integer
 *                   description: ID of the uploaded file
 *                 name:
 *                   type: string
 *                   description: Original filename
 *                 cids:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: IPFS content identifiers for the file parts
 *                 isPrivate:
 *                   type: boolean
 *                   description: Privacy status of the file
 *       400:
 *         description: No file was sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Failed to upload file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// ✅ API: Upload a file
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  const file = req.file;
  const { isPrivate } = req.body;
  if (!file) return res.status(400).json({ error: "No file was sent." });

  console.log(`✅ Received file: ${file.originalname}`);

  try {
    // 1. Split the file
    const parts = splitFileIntoParts(file.path);
    console.log("🧩 File split into:", parts);

    // 2. Upload each part to a different IPFS node
    const cids = [];

    for (let i = 0; i < parts.length; i++) {
      const cid = await uploadToIpfsNode(parts[i], ipfsNodes[i]);
      console.log(`📦 Uploaded part ${i + 1} to IPFS${i + 1}: ${cid}`);
      cids.push(cid);
    }

    // 3. Delete temporary files
    fs.unlinkSync(file.path);
    parts.forEach((p) => fs.unlinkSync(p));

    // 4. Save file metadata to database
    const savedFile = await File.create({
      filename: file.originalname,
      cid1: cids[0],
      cid2: cids[1],
      cid3: cids[2],
      owner_id: req.user.id,
      is_private: isPrivate === 'true' || isPrivate === true,
    });

    // 5. Return data to frontend
    return res.json({
      fileId: savedFile.id,
      name: savedFile.filename,
      cids: cids,
      isPrivate: savedFile.is_private,
    });
  } catch (err) {
    console.error("❌ Error during file upload:", err);
    return res.status(500).json({ error: "Failed to upload file." });
  }
});

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get files from smart contract
 *     description: Retrieve all files registered on the blockchain smart contract
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files from smart contract
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: File name
 *                   cids:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: IPFS content identifiers
 *                   owner:
 *                     type: string
 *                     description: Owner address
 *                   timestamp:
 *                     type: integer
 *                     description: Registration timestamp
 *       500:
 *         description: Failed to fetch files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// ✅ API: Fetch files registered on the smart contract
app.get("/files", async (req, res) => {
  try {
    const result = await contract.getAllFiles();

    const files = result.fileNames.map((name, i) => ({
      name,
      cids: [result.cid1s[i], result.cid2s[i], result.cid3s[i]],
      owner: result.owners[i],
      timestamp: Number(result.timestamps[i]),
    }));

    res.json(files.reverse());
  } catch (err) {
    console.error("❌ Failed to fetch files:", err);
    res.status(500).json({ error: "An error occurred while fetching files" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});
