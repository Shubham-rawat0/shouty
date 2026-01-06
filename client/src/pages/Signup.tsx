import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa6";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

function Signup() {
  const navigate = useNavigate();

  const serverUrl = import.meta.env.VITE_BACKEND_URL;
  if (!serverUrl) {
    throw new Error("No server URL configured");
  }

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Practical email regex (same as Signin)
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  async function handleSignup() {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/user/api/signup`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Signup failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/user/api/auth/google";
  };

  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-[40%] bg-[#f8f8f8] border-r-2 flex flex-col gap-13">
        <div
          className="pl-15 pt-5 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/landing")}
        >
          shouty
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="items-start px-25 text-[#171717] text-3xl">
            Get started
          </h1>
          <h2 className="items-start px-25 text-[#525252] font-semibold">
            Create a new account
          </h2>

          <div className="mt-10 flex items-center justify-center px-25">
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{
                scale: 1.03,
                y: -1,
                backgroundColor: "#ffffff",
                borderColor: "#a3a3a3",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="flex items-center gap-3 justify-center bg-[#fdfdfd] text-[#171717] border-2 border-[#d4d4d4] cursor-pointer w-full py-2 rounded-lg"
            >
              <FaGoogle size={20} />
              Continue with Google
            </motion.button>
          </div>
        </div>

        <div className="relative flex items-center justify-center mx-15">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="absolute px-5 bg-[#f8f8f8] text-foreground">or</span>
        </div>

        <div className="flex flex-col space-y-5">
          <div>
            <h2 className="text-[#171717] ml-25">Email</h2>
            <div className="flex justify-center mt-2 px-25">
              <Input
                type="email"
                placeholder="you@email.com"
                className="bg-[#17171707] border-2 border-[#c7c7c7]"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[#171717] ml-25">Password</h2>
            <div className="relative flex justify-center mt-3 px-25">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#17171707] border-2 border-[#c7c7c7] pr-10"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-30 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center px-25">
            <motion.button
              onClick={handleSignup}
              disabled={loading}
              whileHover={{
                scale: 1.01,
                backgroundColor: "#72e3ad",
                borderColor: "#a3a3a3",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "tween", stiffness: 50, damping: 10 }}
              className="flex items-center gap-3 justify-center bg-[#6bdda6] text-[#171717] cursor-pointer border-2 border-[#16b674bf] w-full py-2 rounded-lg"
            >
              {loading ? <Spinner /> : "Sign up"}
            </motion.button>
          </div>

          {error && (
            <div className="text-center text-xs text-[#171717]">{error}</div>
          )}

          <div className="text-center text-xs text-[#171717]">
            Already have an account?{" "}
            <Link to="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="w-[60%] bg-[#fcfcfc] flex items-center">
        <div className="relative max-w-md mx-auto px-5">
          <span
            aria-hidden
            className="absolute -top-14 -left-6 text-[220px] leading-none text-black/5 select-none font-serif"
          >
            “
          </span>

          <p className="relative text-4xl text-[#404040] leading-relaxed">
            Tried Shouty for sharing links and it feels lightweight and
            reliable. The short links load fast and the UI is easy to
            understand.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfKyATwEQcFTMMoEbMYFbr9yl-sivhiKAe9A&s"
              alt="anakin avatar"
              className="h-8 w-8 rounded-full grayscale"
            />
            <p className="text-sm text-[#737373]">@anakinskywalker</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
