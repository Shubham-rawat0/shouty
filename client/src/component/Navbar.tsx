import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  logged: boolean;
}

function Navbar({ logged }: NavbarProps) {
  const navigate = useNavigate();

   const serverUrl = import.meta.env.VITE_BACKEND_URL;
   if (!serverUrl) {
     throw new Error("No server URL configured");
   }

  async function Logout(){
    const response = await axios.get(`${serverUrl}/user/api/logout`,{withCredentials:true})
    if (response.status==200){
      navigate("/landing")
    }
  }

  const route = logged ? "/" : "/signin";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 bg-slate-950 backdrop-blur border-b border-slate-800"
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-white">
        {/* Logo */}
        <div
          onClick={() => navigate(route)}
          className="text-2xl font-bold cursor-pointer tracking-tight"
        >
          Shouty
        </div>

        {/* Actions */}
        <Button
          onClick={() => (logged ? Logout() : navigate("/signin"))}
          size="lg"
          className="bg-[#4ff0b7] text-black text-lg hover:bg-[#3fd9a3]"
        >
          {logged ? "Log out" : "Log in"}
        </Button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
