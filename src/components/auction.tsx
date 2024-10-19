import React, { useState, useEffect, useCallback } from 'react';
import { NavProps } from "@/types/navigationProps";
import { Button } from "./ui/button";
import Team from "./team";
import CommunicationController from '@/model/CommunicationController';

const communicationController = new CommunicationController();

const Auction: React.FC<NavProps> = ({ handleNavigation }) => {
    const [opponents, setOpponents] = useState<string[]>([]);

    useEffect(() => {
        const initializeAuction = async () => {
            try {
                const savedOpponents = window.localStorage.getItem('opponents');
                const opponentList = savedOpponents ? JSON.parse(savedOpponents) : ['Opponent 1', 'Opponent 2', 'Opponent 3'];
                setOpponents(opponentList);
                await communicationController.initialize(opponentList);
            } catch (error) {
                console.error('Error initializing auction:', error);
            }
        };

        initializeAuction();
    }, []);

    const handleTeamUpdate = useCallback(() => {
        // Trigger any necessary updates after a team change
    }, []);

    const handleFinishAuction = useCallback(async () => {
        try {
            await communicationController.finishAuction();
            handleNavigation('home');
        }
        catch (error) {
            console.error('Error finishing auction:', error);
        }
      }, [communicationController]);

      const handleGenerateTeam = useCallback(async () => {
        try {
            let teams = await communicationController.generateSquads();
            console.log(teams)
        }
        catch (error) {
            console.error('Error finishing auction:', error);
        }
      }, [communicationController]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                    <Team 
                        teamName="La tua Squadra" 
                        isMainTeam={true}
                        communicationController={communicationController}
                        onTeamUpdate={handleTeamUpdate}
                    />
                </div>

                <div className="lg:w-1/2 bg-red-500">
                    <p>Spazio per le squadre generate...</p>
                    <Button onClick={() => handleGenerateTeam()}>Genera Team</Button>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opponents.map((opponent, index) => (
                    <Team 
                        key={index} 
                        teamName={opponent} 
                        isMainTeam={false}
                        communicationController={communicationController}
                        onTeamUpdate={handleTeamUpdate}
                    />
                ))}
            </div>

            <div className="mt-6">
                <Button onClick={() => handleFinishAuction()}>Termina Asta</Button>
            </div>
        </div>
    );
}

export default Auction;