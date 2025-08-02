import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUploadFile } from "@/hooks/useFiles";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const { user, logout } = useAuth();
  const uploadFile = useUploadFile();
  const wallet = useWallet();
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileUpload = async (file: File, isPrivate: boolean) => {
    try {
      setUploadStatus("💰 Requesting payment from user via MetaMask...");
      
      // 1. Connect to wallet if not already connected
      if (!wallet.isConnected || !wallet.walletConnection) {
        await wallet.connectWallet();
      }

      setUploadStatus("🔄 Uploading the file to the server...");

      // 2. Upload the file to the backend
      const uploadResult = await uploadFile.mutateAsync({ file, isPrivate });
      const { fileId, cids, name } = uploadResult;

      setUploadStatus("📝 Registering the data on the blockchain...");

      // 3. Register on blockchain
      const txHash = await wallet.storeFileOnBlockchain(name, cids);

      setUploadStatus("🎉 0.01 ETH paid and file registered successfully!");
      
      // Clear status after a few seconds
      setTimeout(() => setUploadStatus(""), 5000);

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadStatus(`❌ Error: ${errorMessage}`);
      
      // Clear error status after a few seconds
      setTimeout(() => setUploadStatus(""), 8000);
    }
  };

  if (!user) {
    return null; // This should not happen due to ProtectedRoute, but just in case
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Upload to the Storm</h1>
            <p className="text-xl text-muted-foreground">
              Secure your files with decentralized storage and blockchain verification
            </p>
          </div>

          {/* Wallet Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!wallet.isMetaMaskInstalled ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>MetaMask not installed. Please install MetaMask to continue.</span>
                </div>
              ) : wallet.isConnected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Wallet Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Account:</span>
                    <Badge variant="secondary" className="font-mono">
                      {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={wallet.disconnect}
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Wallet not connected</span>
                  </div>
                  <Button 
                    onClick={wallet.connectWallet}
                    className="flex items-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Status */}
          {uploadStatus && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-lg">{uploadStatus}</p>
              </CardContent>
            </Card>
          )}
          
          <FileUpload 
            onFileUpload={handleFileUpload}
            isUploading={uploadFile.isPending}
          />

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="shrink-0">1</Badge>
                <div>
                  <p className="font-medium">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">Connect MetaMask to pay for blockchain registration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="shrink-0">2</Badge>
                <div>
                  <p className="font-medium">Upload to IPFS</p>
                  <p className="text-sm text-muted-foreground">Your file is securely stored on the decentralized IPFS network</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="shrink-0">3</Badge>
                <div>
                  <p className="font-medium">Blockchain Registration</p>
                  <p className="text-sm text-muted-foreground">Pay 0.01 ETH to register your file on the blockchain for permanent verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}