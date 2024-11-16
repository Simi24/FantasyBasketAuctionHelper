import React, { useState, KeyboardEvent, ChangeEvent, useEffect} from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Trophy } from "lucide-react";
import CommunicationController from '@/model/CommunicationController';
import { NavProps } from '@/types/navigationProps';
import { Label } from "@/components/ui/label";
import BasketballSVG from './basketballSVG';

const Home: React.FC<NavProps> = ({ handleNavigation }) => {
    const [opponent, setOpponent] = useState<string>("");
    const [opponents, setOpponents] = useState<string[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [availablePlayers, setAvailablePlayers] = useState<string[]>([]);
    const [budget, setBudget] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        window.localStorage.setItem('opponents', JSON.stringify(opponents));
    }, [opponents]);
    
    useEffect(() => {
        window.localStorage.setItem('availablePlayers', JSON.stringify(availablePlayers));
        console.log('setting availablePlayers in local storage:', availablePlayers);
    }, [availablePlayers]);

    const communicationController = new CommunicationController();

    const addOpponent = (newOpponent: string) => {
        const lowerCaseOpponent = newOpponent.toLowerCase().trim();
        if (lowerCaseOpponent && !opponents.includes(lowerCaseOpponent)) {
            setOpponents([...opponents, lowerCaseOpponent]);
            setOpponent("");
        }
    }

    const removeOpponent = (index: number) => {
        setOpponents(opponents.filter((_, i) => i !== index));
    }

    const handleInitAuction = async () => {
        try {
            if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
                alert("Please insert a valid budget");
                return;
            }
            
            setWaiting(true);
            let response = await communicationController.initialize(opponents, Number(budget));
            const players = await communicationController.availablePlayers();
            window.localStorage.setItem('availablePlayers', JSON.stringify(availablePlayers));
            window.localStorage.setItem('totBudget', JSON.stringify(budget));
            setAvailablePlayers(players);
            setWaiting(false);
            console.log('response in handleInitAuction:', response);
            handleNavigation('auction');
        } catch (error) {
            console.error('Error initializing:', error);
            throw error;
        }
    }

    const handleSubmit = () => {
        handleInitAuction()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addOpponent(opponent);
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOpponent(e.target.value);
    }

    const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
            setBudget(value);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-700 flex flex-col md:flex-row">
            <div className="fixed top-10 right-10 animate-bounce">
                <BasketballSVG />
            </div>

            <main className="flex-grow container mx-auto px-4 py-8 z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-2xl mx-auto border-2 border-orange-400">
                    <div className="flex items-center justify-center mb-8">
                        <Trophy className="text-orange-500 w-10 h-10 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-800">Fantasy Basketball Auction Helper</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="budget" className="text-lg font-semibold text-gray-700 flex items-center">
                                <span className="mr-2">💰</span> Budget
                            </Label>
                            <Input
                                id="budget"
                                type="number"
                                placeholder="Insert your budget"
                                value={budget}
                                onChange={handleBudgetChange}
                                className="text-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex space-x-2">
                                <Input 
                                    placeholder="Insert opponent name" 
                                    value={opponent} 
                                    onChange={handleInputChange} 
                                    onKeyDown={handleKeyDown}
                                    className="text-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                                />
                                <Button 
                                    onClick={() => addOpponent(opponent)} 
                                    className="bg-orange-500 hover:bg-orange-600 transition-all duration-300"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {opponents.map((opponent, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all duration-300"
                                >
                                    <Badge variant="secondary" className="text-lg px-4 py-1 bg-orange-100 text-orange-800">
                                        {opponent}
                                    </Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeOpponent(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                                        disabled={waiting}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {opponents.length > 0 && (
                            <Button 
                                onClick={handleSubmit} 
                                className={`w-full bg-orange-500 hover:bg-orange-600 text-xl py-4 font-bold transition-all duration-300 ${
                                    isHovered ? 'transform scale-105' : ''
                                }`}
                                disabled={!budget || Number(budget) <= 0 || opponents.length < 2}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Start the Auction 🏀
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;