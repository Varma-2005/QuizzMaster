import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../src/hooks/useAuth';
import { MdDashboard, MdLogout, MdLogin, MdMenu, MdClose, MdQuiz } from 'react-icons/md';
import { FaBrain, FaUserCircle } from 'react-icons/fa';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  if (isAuthPage) return null;

  const NavLink = ({ to, icon: Icon, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 font-medium"
    >
      <Icon className="text-xl" />
      <span>{children}</span>
    </Link>
  );

  const MobileNavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all font-medium"
    >
      <Icon className="text-xl" />
      <span>{children}</span>
    </Link>
  );

  const UserProfile = ({ mobile = false }) => (
    <div className={`flex items-center space-x-${mobile ? '3' : '2'} px-4 py-${mobile ? '3' : '2.5'} ${mobile ? 'bg-gradient-to-r from-orange-50 to-orange-100 mb-3' : 'bg-orange-50'} rounded-xl`}>
      <FaUserCircle className={`text-${mobile ? '3xl' : '2xl'} text-orange-500`} />
      <div className="flex flex-col">
        <span className={`text-sm font-${mobile ? 'bold' : 'semibold'} text-gray-800`}>
          {user?.firstName} {user?.lastName}
        </span>
        <span className={`text-xs ${mobile ? 'text-gray-600' : 'text-gray-500'}`}>
          {user?.branch} • Year {user?.year}
        </span>
      </div>
    </div>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white shadow-md'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="bg-orange-500 rounded-2xl p-2.5 shadow-md group-hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBrain className="text-2xl text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                QuizMaster
              </span>
              <span className="text-xs text-gray-500 -mt-1">B.Tech Learning Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/quiz-selection" icon={MdQuiz}>Take Quiz</NavLink>
                <NavLink to="/dashboard" icon={MdDashboard}>Dashboard</NavLink>
                <UserProfile />
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdLogout className="text-lg" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  <MdLogin className="text-xl" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <nav className="pt-4 pb-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    <UserProfile mobile />
                    <MobileNavLink to="/quiz-selection" icon={MdQuiz}>Take Quiz</MobileNavLink>
                    <MobileNavLink to="/dashboard" icon={MdDashboard}>Dashboard</MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md"
                    >
                      <MdLogout className="text-xl" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all font-medium"
                    >
                      <MdLogin className="text-xl" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all font-semibold shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Header;