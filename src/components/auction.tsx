import { NavProps } from "@/types/navigationProps";
import { Button } from "./ui/button";
import Team from "./team";

const Auction: React.FC<NavProps> = ({ handleNavigation }) => {

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-blue-600">Auction Page</h1>
            </div>
            <div>
                <Team />
            </div>
            <div>
                <Button onClick={() => handleNavigation('home')}>Go to Home</Button>
            </div>
        </div>
    );
}

export default Auction;