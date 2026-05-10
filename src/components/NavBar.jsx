import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavBar = () => {
  const navItems = [
    { name: 'Machine Learning', path: '/ml' },
    { name: 'Data Structures & Algorithms', path: '/dsa' },
    { name: 'System Design', path: '/system-design' },
    { name: 'Databases', path: '/databases' },
    { name: 'Case Studies', path: '/case-studies' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020611]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-space font-bold tracking-tighter text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-electric-cyan)] to-[var(--color-phosphor-green)]">Intuition</span> Engineering
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-3 py-2 rounded-md text-sm font-space font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-electric-cyan)]"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
