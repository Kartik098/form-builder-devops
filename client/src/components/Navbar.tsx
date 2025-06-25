"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>Form Builder</div>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>{user.name || user.email}</span>
          <button onClick={handleSignOut} style={btnStyle}>Sign Out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  backgroundColor: "#f4f4f4",
  borderBottom: "1px solid #ddd",
};

const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#e63946",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
