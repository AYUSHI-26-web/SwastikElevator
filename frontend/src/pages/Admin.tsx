import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (formData.username === 'admin' && formData.password === 'password') {
        setIsLoggedIn(true);
        toast({
          title: "Login Successful!",
          description: "Welcome to the admin dashboard.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-4xl mx-auto shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
                  Management Portal
                </span>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Swastik Elevator Admin Control
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Himanchal Enterprises Service Dispatch & Inquiries Terminal
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
                <div className="bg-blue-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-blue-100 dark:border-slate-700/60">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Service Requests</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• Instant Booking Queue</li>
                    <li>• Emergency Repair Hotline</li>
                    <li>• Technician Dispatch</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-amber-100 dark:border-slate-700/60">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Client Portfolio</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• Active AMC Contracts</li>
                    <li>• Inspection Logs</li>
                    <li>• Project Case Studies</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700/60">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Analytics & Reports</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• Monthly Service Revenue</li>
                    <li>• Spare Parts Inventory</li>
                    <li>• Client Feedback Rating</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300"
                >
                  Logout
                </button>
                
                <p className="text-xs text-muted-foreground">
                  This is a demo interface. In a production environment, this would be connected 
                  to a proper backend system with role-based access control.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-neutral/30">
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Admin Login
              </h2>
              <p className="text-muted-foreground">
                Access the Himanchal Enterprises management panel
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="input-form pl-11"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="input-form pl-11 pr-11"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-hero"
              >
                Sign In
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-neutral/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-center space-y-1">
                <p><span className="font-medium">Username:</span> admin</p>
                <p><span className="font-medium">Password:</span> password</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don’t have an admin account?{' '}
                <Link to="/admin/register" className="font-medium text-primary hover:text-primary-dark">
                  Create one
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Secure admin access for authorized personnel only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;