import React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-center border-b border-border">
        <h1 className="text-xl font-medium">MicroHabits</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} MicroHabits. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
