import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, File, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File, isPrivate: boolean) => void;
  isUploading?: boolean;
}

export function FileUpload({ onFileUpload, isUploading = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    try {
      await onFileUpload(selectedFile, isPrivate);
      setSelectedFile(null);
      setIsPrivate(false);
    } catch (error) {
      // Error handling is done in the parent component/hook
      console.error('Upload error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {selectedFile ? (
              <div className="space-y-2">
                <File className="h-12 w-12 mx-auto text-primary" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
                  </p>
                  <p className="text-muted-foreground">or click to select (max 10MB)</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Options */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="private-file"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={isUploading}
              />
              <Label htmlFor="private-file">Make file private</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Private files can only be accessed by you and won't appear in public listings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleUpload} 
              className="w-full" 
              size="lg"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Storm Network
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}