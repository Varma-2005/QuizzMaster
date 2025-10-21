import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaHeart, FaGithub, FaLinkedin, FaEnvelope, FaRocket } from 'react-icons/fa';
import { MdQuiz, MdDashboard } from 'react-icons/md';

const socialLinks = [
  { icon: FaGithub, url: 'https://github.com/Varma-2005', label: 'GitHub', color: 'hover:bg-gray-800' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/bhuvanesh-vardhan-varma-nampally-a6a865291', label: 'LinkedIn', color: 'hover:bg-blue-600' },
  { icon: FaEnvelope, url: 'mailto:bhuvaneshitc05@gmail.com', label: 'Email', color: 'hover:bg-orange-600' }
];

const quickLinks = [
  { name: 'Take Quiz', path: '/quiz-selection', icon: MdQuiz },
  { name: 'Dashboard', path: '/dashboard', icon: MdDashboard },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' }
];

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-500 rounded-2xl p-2.5">
                <FaBrain className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">QuizMaster</h3>
                <p className="text-xs text-gray-400">B.Tech Learning Platform</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Empowering B.Tech students with AI-powered quizzes, instant feedback, and comprehensive progress tracking.
            </p>
            <div className="flex items-center space-x-2 text-sm text-orange-400">
              <FaRocket className="text-lg" />
              <span className="font-medium">Start Learning Today!</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors group"
                  >
                    {link.icon && <link.icon className="text-lg group-hover:scale-110 transition-transform" />}
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-white mb-4">Connect With Us</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Follow us on social media for updates, tips, and learning resources.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-11 h-11 rounded-xl bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-300 ${social.color} hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700 hover:border-orange-500`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
          </p>

          <div className="flex items-center text-sm text-gray-500">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-2"
            >
              <FaHeart className="text-red-500 text-lg" />
            </motion.div>
            <span>for B.Tech students</span>
          </div>

          <p className="text-gray-500 text-sm">
            Designed & Developed by{' '}
            <a 
              href="https://github.com/Varma-2005" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Bhuvanesh Vardhn Varma
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;