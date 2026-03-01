
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUserRole } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await login(username, password);
      
      // Redirect based on role
      const role = getUserRole();
      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "CASHIER":
          navigate("/cashier");
          break;
        case "BARISTA":
          navigate("/barista");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      const message = err.message === "Login failed" 
        ? "Invalid username or password" 
        : "Network error. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Coffee Shop POS</h1>
          <p className="text-gray-600 text-sm mt-1">Please sign in to continue</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              autoComplete="username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 
                       disabled:bg-blue-300 disabled:cursor-not-allowed font-medium
                       transition-colors flex justify-center items-center"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}


// // src/components/Login.tsx
// import { useState, useEffect } from "react";
// import { login } from "../services/authService";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false); // Add loading state
//   const [showPassword, setShowPassword] = useState(false);

//       // Temporary: Auto-fill for testing
//     useEffect(() => {
//     // Remove this in production!
//     setUsername("vyra.vannarith");
//     setPassword("admin#1234");
//     }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (isLoading) return; // Prevent double submission
    
//     setIsLoading(true);
//     setError(null);


//     try {
//       await login(username, password);
//       window.location.href = "/";
//     } catch (err: any) {
//       // Better error handling
//       const message = err.message === "Login failed" 
//         ? "Invalid username or password" 
//         : "Network error. Please try again.";
//       setError(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//         >
//         <h1 className="text-xl font-bold mb-4">Login</h1>
//         {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-3 text-sm">
//             {error}
//             </div>
//         )}
        
//         <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             disabled={isLoading}
//             className="w-full p-2 border rounded mb-3 disabled:bg-gray-100"
//             autoComplete="username"
//         />

//         {/* PASSWORD WRAPPER */}
//         <div className="relative w-full mb-3">
//             <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             disabled={isLoading}
//             className="w-full p-2 border rounded disabled:bg-gray-100 pr-10"
//             autoComplete="current-password"
//             />
//             <button
//             type="button" // Important: prevents form submission
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
//             disabled={isLoading}
//             >
//             {showPassword ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
//                 </svg>
//             ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//             )}
//             </button>
//         </div>

//         <button
//             type="submit"
//             disabled={isLoading || !username || !password}
//             className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 
//                     disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center"
//         >
//             {isLoading ? (
//             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//             ) : (
//             "Login"
//             )}
//         </button>
//         </form>
//     </div>
//     );
// }