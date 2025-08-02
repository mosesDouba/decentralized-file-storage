import { Button } from "@/components/ui/button";
import { LogOut, Cloud } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "@/types/file";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-foreground">STORME</span>
          </Link>
          
          {user && (
            <nav className="flex space-x-4">
              <Link to="/upload">
                <Button 
                  variant={location.pathname === "/upload" ? "default" : "ghost"}
                  size="sm"
                >
                  Upload
                </Button>
              </Link>
              <Link to="/files">
                <Button 
                  variant={location.pathname === "/files" ? "default" : "ghost"}
                  size="sm"
                >
                  Uploaded Files
                </Button>
              </Link>
              <Link to="/my-files">
                <Button 
                  variant={location.pathname === "/my-files" ? "default" : "ghost"}
                  size="sm"
                >
                  My Files
                </Button>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.username}
                {user.isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                    Admin
                  </span>
                )}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}