// Updated types to match API responses
export interface FileData {
  id: string | number;
  name: string;
  owner: string;
  timestamp: Date | number;
  isPrivate: boolean;
  size: number;
  cid1?: string;
  cid2?: string;
  cid3?: string;
  cids?: string[]; // For API compatibility
  type: string;
}

export interface User {
  id?: number;
  username: string;
  role?: string;
  isAdmin?: boolean;
}

// Additional types for authentication
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Helper function to convert API file to FileData
export const convertApiFileToFileData = (apiFile: any): FileData => {
  return {
    id: apiFile.id,
    name: apiFile.name || apiFile.filename,
    owner: apiFile.owner,
    timestamp: typeof apiFile.timestamp === 'number' ? apiFile.timestamp : new Date(apiFile.created_at || apiFile.timestamp).getTime(),
    isPrivate: apiFile.is_private || apiFile.isPrivate,
    size: apiFile.size || 0,
    cid1: apiFile.cid1 || apiFile.cids?.[0],
    cid2: apiFile.cid2 || apiFile.cids?.[1],
    cid3: apiFile.cid3 || apiFile.cids?.[2],
    cids: apiFile.cids || [apiFile.cid1, apiFile.cid2, apiFile.cid3].filter(Boolean),
    type: apiFile.type || 'application/octet-stream'
  };
};