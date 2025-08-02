import { Header } from "@/components/Header";
import { FileTable } from "@/components/FileTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAllFiles, useUpdateFileVisibility, useDeleteFile } from "@/hooks/useFiles";
import { Loader2, AlertCircle, Files } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FilesPage() {
  const { user, logout } = useAuth();
  const { data: files, isLoading, error, refetch } = useAllFiles();
  const updateVisibility = useUpdateFileVisibility();
  const deleteFile = useDeleteFile();

  const handleFileUpdate = async (fileId: string | number, updates: { isPrivate?: boolean }) => {
    if (updates.isPrivate !== undefined) {
      try {
        await updateVisibility.mutateAsync({ 
          fileId: Number(fileId), 
          isPrivate: updates.isPrivate 
        });
      } catch (error) {
        console.error('Failed to update file visibility:', error);
      }
    }
  };

  const handleFileDelete = async (fileId: string | number) => {
    try {
      await deleteFile.mutateAsync(Number(fileId));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  if (!user) {
    return null; // This should not happen due to ProtectedRoute
  }

  // Show only public files for non-admin users
  const visibleFiles = user.isAdmin 
    ? files || []
    : (files || []).filter(file => !file.isPrivate);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <Files className="h-8 w-8" />
              Uploaded Files
            </h1>
            <p className="text-muted-foreground">
              {user.isAdmin 
                ? "All files in the network (Admin View)" 
                : "Public files available on the network"
              }
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load files: {error.message}
                <button 
                  onClick={() => refetch()} 
                  className="ml-2 underline hover:no-underline"
                >
                  Try again
                </button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Files ({isLoading ? "..." : visibleFiles.length})
                {user.isAdmin && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    Admin privileges active
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading files...</span>
                </div>
              ) : visibleFiles.length > 0 ? (
                <FileTable 
                  files={visibleFiles}
                  user={user}
                  showAllColumns={user.isAdmin}
                  onFileUpdate={handleFileUpdate}
                  onFileDelete={handleFileDelete}
                  isUpdating={updateVisibility.isPending}
                  isDeleting={deleteFile.isPending}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No files found.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Be the first to upload a file to the Storm Network!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}