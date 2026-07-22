import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      onLogin();
    } catch (err: any) {
      alert("Email atau Password salah.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0F4C81",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: 360,
          background: "white",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 5px 20px rgba(0,0,0,.2)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          SIM-KONTRAK PJJ
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 25,
          }}
        >
          Login Administrator
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#0F4C81",
            color: "white",
            border: 0,
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "MASUK"}
        </button>
      </form>
    </div>
  );
}