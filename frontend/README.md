
# Project Documentation

This document provides a comprehensive overview of the `new-frontend` project, including its structure, functionality, and instructions on how to run it.

## Project Structure

The project follows a standard React project structure, with the source code located in the `src` directory.

```
new-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── abis/
│   │   └── FileRegistry.json
│   ├── assets/
│   │   └── storm-background.jpg
│   ├── components/
│   │   ├── ui/
│   │   ├── AuthDialog.tsx
│   │   ├── FileTable.tsx
│   │   ├── FileUpload.tsx
│   │   └── Header.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useFiles.ts
│   │   └── useWallet.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── FilesPage.tsx
│   │   ├── Index.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MyFilesPage.tsx
│   │   ├── NotFound.tsx
│   │   └── UploadPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── wallet.ts
│   ├── types/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

### Key Directories

*   `src/components`: Contains reusable UI components.
*   `src/pages`: Contains the main pages of the application.
*   `src/hooks`: Contains custom React hooks.
*   `src/contexts`: Contains React context providers for state management.
*   `src/services`: Contains modules for interacting with APIs and blockchain.
*   `src/abis`: Contains ABI files for interacting with smart contracts.

## Functionality

This project appears to be a decentralized file storage application. Based on the file names and project structure, the key functionalities are:

*   **User Authentication**: Wallet-based authentication using `AuthContext` and `AuthDialog`.
*   **File Upload**: Users can upload files through the `FileUpload` component on the `UploadPage`.
*   **File Listing**: Users can view a list of their uploaded files on `MyFilesPage` and all files on `FilesPage`.
*   **Blockchain Interaction**: The application interacts with an Ethereum smart contract (`FileRegistry.json`) to manage files, facilitated by the `ethers` library and custom hooks like `useWallet`.
*   **API Interaction**: The `api.ts` service and `useFiles` hook handle communication with a backend API to manage file metadata.

## How to Run the Project

To run this project locally, follow these steps:

1.  **Install Dependencies**: Open a terminal in the `new-frontend` directory and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

2.  **Run the Development Server**: After the installation is complete, start the development server:
    ```bash
    npm run dev
    ```
    This will start the application on a local server, typically at `http://localhost:3000`.

### Available Scripts

The `package.json` file defines the following scripts:

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Builds the application for production.
*   `npm run build:dev`: Builds the application in development mode.
*   `npm run lint`: Lints the code to check for errors.
*   `npm run preview`: Serves the production build locally to preview it. 