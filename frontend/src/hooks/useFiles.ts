import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { convertApiFileToFileData, type FileData } from '@/types/file';
import { useToast } from '@/hooks/use-toast';

// Hook to get all files from database
export const useAllFiles = () => {
  return useQuery({
    queryKey: ['files', 'all'],
    queryFn: async () => {
      const files = await apiService.getAllFiles();
      return files.map(convertApiFileToFileData);
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook to get files from smart contract
export const useSmartContractFiles = () => {
  return useQuery({
    queryKey: ['files', 'smart-contract'],
    queryFn: async () => {
      const files = await apiService.getSmartContractFiles();
      return files.map(convertApiFileToFileData);
    },
    staleTime: 60000, // 1 minute
  });
};

// Hook to upload files
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, isPrivate }: { file: File; isPrivate: boolean }) => 
      apiService.uploadFile(file, isPrivate),
    onSuccess: (data) => {
      // Invalidate and refetch file lists
      queryClient.invalidateQueries({ queryKey: ['files'] });
      
      toast({
        title: "Upload Successful",
        description: `${data.name} has been uploaded successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to update file visibility
export const useUpdateFileVisibility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ fileId, isPrivate }: { fileId: number; isPrivate: boolean }) =>
      apiService.updateFileVisibility(fileId, isPrivate),
    onSuccess: (data) => {
      // Invalidate and refetch file lists
      queryClient.invalidateQueries({ queryKey: ['files'] });
      
      toast({
        title: "Visibility Updated",
        description: `File visibility has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete files
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fileId: number) => apiService.deleteFile(fileId),
    onSuccess: () => {
      // Invalidate and refetch file lists
      queryClient.invalidateQueries({ queryKey: ['files'] });
      
      toast({
        title: "File Deleted",
        description: "File has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to get user's files (filtered from all files)
export const useUserFiles = (username?: string) => {
  return useQuery({
    queryKey: ['files', 'user', username],
    queryFn: async () => {
      const files = await apiService.getAllFiles();
      const userFiles = files.filter(file => file.owner === username);
      return userFiles.map(convertApiFileToFileData);
    },
    enabled: !!username,
    staleTime: 30000,
  });
}; 