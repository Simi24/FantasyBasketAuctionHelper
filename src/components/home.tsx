import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import CommunicationController from '@/model/CommunicationController';
import { NavProps } from '@/types/navigationProps';

const Home: React.FC<NavProps> = ({ handleNavigation }) => {
    const [opponent, setOpponent] = useState<string>("");
    const [opponents, setOpponents] = useState<string[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);

    useEffect(() => {
        if (waiting) {
            //document.body.style.cursor = 'wait';
        }
        else {
            //document.body.style.cursor = 'default';
        }
    }, [waiting]);

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
            setWaiting(true);
            let response = await communicationController.initialize(opponents);
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Inizia la tua asta</h2>
                    
                    <div className="space-y-6">
                        <div className="flex space-x-2">
                            <Input 
                                placeholder="Inserisci il nome dell'avversario" 
                                value={opponent} 
                                onChange={handleInputChange} 
                                onKeyDown={handleKeyDown}
                                className="flex-grow"
                            />
                            <Button onClick={() => addOpponent(opponent)} className="bg-green-500 hover:bg-green-600">
                                <UserPlus className="mr-2 h-4 w-4" /> Aggiungi
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {opponents.map((opponent, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                                    <Badge variant="secondary" className="text-lg px-3 py-1">{opponent}</Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeOpponent(index)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={waiting}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {opponents.length > 0 && (
                            <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-3">
                                Inizia l'asta
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;