import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
                &copy; {new Date().getFullYear()} FantasyBasket Auction Helper. Made By Simi ❤️.
            </div>
        </footer>
    );
};

export default Footer;