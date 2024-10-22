import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
        {/* Basketball SVG Animation */}
            <div className="fixed top-10 right-10 animate-bounce">
                <svg width="50" height="50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#ff6b00" stroke="#000" strokeWidth="2" />
                    <path d="M50 5 C50 95 50 5 50 95" stroke="#000" strokeWidth="2" />
                    <path d="M5 50 C95 50 5 50 95 50" stroke="#000" strokeWidth="2" />
                </svg>
            </div>
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-blue-600">FantasyBasket Auction Helper</h1>
            </div>
        </header>
    );
};

export default Header;