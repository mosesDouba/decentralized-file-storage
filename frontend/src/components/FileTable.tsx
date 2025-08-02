import { useState } from "react";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileData, User } from "@/types/file";

interface FileTableProps {
  files: FileData[];
  user: User;
  showAllColumns?: boolean;
  onFileUpdate: (fileId: string | number, updates: { isPrivate?: boolean }) => void;
  onFileDelete: (fileId: string | number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function FileTable({ 
  files, 
  user, 
  showAllColumns = false, 
  onFileUpdate, 
  onFileDelete,
  isUpdating = false,
  isDeleting = false
}: FileTableProps) {
  const { toast } = useToast();

  const handlePrivacyToggle = (fileId: string | number, isPrivate: boolean) => {
    onFileUpdate(fileId, { isPrivate });
  };

  const downloadAndMerge = async (cids, name) => {
    try {
      const buffers = await Promise.all(
        cids.map(async (cid, i) => {
          const res = await axios.get(`http://localhost:808${i + 1}/ipfs/${cid}`, {
            responseType: "arraybuffer",
          });
          return new Uint8Array(res.data);
        })
      );

      const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;

      for (let b of buffers) {
        merged.set(b, offset);
        offset += b.length;
      }

      const blob = new Blob([merged], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error while downloading or merging parts:", err);
      alert("An error occurred during download. Make sure the IPFS nodes are running.");
    }
  };

  const handleDownload = (file: FileData) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name} from IPFS...`,
    });
    
    downloadAndMerge(file.cids, file.name);
  };

  const handleDelete = (fileId: string | number, fileName: string) => {
    onFileDelete(fileId);
  };

  const formatDate = (timestamp: Date | number) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canEdit = (file: FileData) => {
    return user.isAdmin || file.owner === user.username;
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files to display
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            {showAllColumns && <TableHead>Privacy</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{file.name}</span>
                  {file.isPrivate && <Eye className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableCell>
              <TableCell>{file.owner}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{formatDate(file.timestamp)}</TableCell>
              {showAllColumns && (
                <TableCell>
                  {canEdit(file) ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={file.isPrivate}
                        onCheckedChange={(checked) => handlePrivacyToggle(file.id, checked)}
                        disabled={isUpdating}
                      />
                      <span className="text-sm">
                        {file.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  ) : (
                    <Badge variant={file.isPrivate ? "secondary" : "outline"}>
                      {file.isPrivate ? "Private" : "Public"}
                    </Badge>
                  )}
                </TableCell>
              )}
              <TableCell>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Stored
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {canEdit(file) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(file.id, file.name)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}