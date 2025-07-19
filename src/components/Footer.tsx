import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 px-8 border-t border-gray-200 bg-white">
      <div className="text-center text-sm text-gray-600">
        Created by{' '}
        <span className="font-semibold" style={{ color: '#2E2C6E' }}>
          Faisal Aldosari '26
        </span>
      </div>
    </footer>
  );
};

export default Footer;
