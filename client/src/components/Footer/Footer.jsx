import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900/60 backdrop-blur-md border-t border-purple-900/40 py-4">
      <div className="container mx-auto text-center">
        <p className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} PathFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
