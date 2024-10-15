import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-blue-600">FantasyBasket Auction Helper</h1>
            </div>
        </header>
    );
};

export default Header;