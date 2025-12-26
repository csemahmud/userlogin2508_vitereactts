// src/components/scenes/manageUsers/LoginUserComponent.tsx
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { loginUser } from "@/shared/services/UserService";
import { motion, AnimatePresence } from "framer-motion";
import { ILoginRequest, ILoginResponse, IApiResponse } from "@/shared/types/interfaces";

interface LoginUserComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (data: ILoginResponse) => void;
}

const LoginUserComponent: React.FC<LoginUserComponentProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ❌ REMOVE THIS
  // if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    const loginData: ILoginRequest = { email, password };

    try {
      const response = await loginUser(loginData);
      const apiResponse: IApiResponse<ILoginResponse> = response.data;

      if (apiResponse.data) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        // ✅ Pass the backend response object directly
        onLoginSuccess?.(apiResponse.data);
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: apiResponse.message || "Login failed",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Unexpected error occurred";
      Swal.fire({
        icon: "error",
        title: msg,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false); // ✅ ALWAYS reset
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
            initial={{ scale: 0.8, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign In</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Email:</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-3 text-gray-600 hover:text-black"
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginUserComponent;
