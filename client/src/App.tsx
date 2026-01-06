import {BrowserRouter ,Route ,Routes} from "react-router-dom"
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/landing" element={<Landing/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/signup" element={<Signup/>}/>
   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
