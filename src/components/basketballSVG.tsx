export default function BasketballSVG() {
    return (
        <svg width="50" height="50" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#ff6b00" stroke="#000" strokeWidth="2" />
        <path d="M50 5 C50 95 50 5 50 95" stroke="#000" strokeWidth="2" />
        <path d="M5 50 C95 50 5 50 95 50" stroke="#000" strokeWidth="2" />
        <path d="M20 20 C35 40 35 60 20 80" stroke="#000" strokeWidth="2" fill="none"/>
        <path d="M80 20 C65 40 65 60 80 80" stroke="#000" strokeWidth="2" fill="none"/>
    </svg>
    );
}