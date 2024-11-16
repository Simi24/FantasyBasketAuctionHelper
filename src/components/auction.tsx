import { useState, useEffect, useCallback } from 'react';
import { Button } from "./ui/button";
import Team from "./team";
import CommunicationController from '@/model/CommunicationController';
import { Squad } from '@/types/squad';
import GeneratedTeamsTable from './generatedTeamsTable';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import BasketballSVG from './basketballSVG';

const communicationController = new CommunicationController();

interface AuctionProps {
    handleNavigation: (route: string) => void;
}

export default function Auction({ handleNavigation}: AuctionProps) {
    const [opponents, setOpponents] = useState<string[]>([]);
    const [availablePlayers, setAvailablePlayers] = useState<string[]>([]);
    const [generatedTeams, setGeneratedTeams] = useState<Squad[]>();

    useEffect(() => {
        const initializeAuction = async () => {
            try {
                const savedOpponents = window.localStorage.getItem('opponents');
                const opponentList = savedOpponents ? JSON.parse(savedOpponents) : ['Opponent 1', 'Opponent 2', 'Opponent 3'];
                setOpponents(opponentList);
                const savedAvailablePlayers = window.localStorage.getItem('availablePlayers');
                const availablePlayersList = savedAvailablePlayers ? JSON.parse(savedAvailablePlayers) : [];
                setAvailablePlayers(availablePlayersList);
            } catch (error) {
                console.error('Error initializing auction:', error);
            }
        };

        initializeAuction();
    }, []);

    const handleTeamUpdate = useCallback(() => {
        getAvailablePlayers();
    }, []);

    useEffect(() => {
        getAvailablePlayers();
    }, []);

    const handleFinishAuction = useCallback(async () => {
        try {
            await communicationController.finishAuction();
            window.localStorage.removeItem('opponents');
            window.localStorage.removeItem('availablePlayers');
            window.localStorage.removeItem('totBudget');
            handleNavigation('home');
        }
        catch (error) {
            console.error('Error finishing auction:', error);
        }
      }, [communicationController]);

      const handleGenerateTeam = useCallback(async () => {
        try {
            const teams = await communicationController.generateSquads();
            console.log('Teams before setState:', teams);
            if (Array.isArray(teams) && teams.length > 0) {
                setGeneratedTeams(teams);
            } else {
                console.error('Invalid teams data structure:', teams);
            }
        }
        catch (error) {
            console.error('Error generating teams:', error);
        }
    }, [communicationController]);

      const getAvailablePlayers = useCallback(async () => {
        try {
          const players = await communicationController.availablePlayers();
          setAvailablePlayers(players);
          window.localStorage.setItem('availablePlayers', JSON.stringify(players));
        } catch (error) {
          console.error('Error fetching available players:', error);
        }
      }, [communicationController]);

      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-700 flex flex-col">
            <div className="fixed top-10 right-10 animate-bounce">
                <BasketballSVG />
            </div>
    
            <main className="flex-grow container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/2">
                        <Team 
                            teamName="Your Team" 
                            isMainTeam={true}
                            communicationController={communicationController}
                            availablePlayersProps={availablePlayers}
                            onTeamUpdate={handleTeamUpdate}
                        />
                    </div>
    
                    <div className="lg:w-1/2">
                        <Card className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-orange-400">
                            <CardHeader>
                                <CardTitle className="text-orange-500 text-2xl font-bold">Generated Teams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    onClick={handleGenerateTeam} 
                                    className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 mb-4"
                                >
                                    Generate Teams
                                </Button>
                                <GeneratedTeamsTable teams={generatedTeams} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
    
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {opponents.map((opponent, index) => (
                        <Team 
                            key={index} 
                            teamName={opponent} 
                            isMainTeam={false}
                            communicationController={communicationController}
                            availablePlayersProps={availablePlayers}
                            onTeamUpdate={handleTeamUpdate}
                        />
                    ))}
                </div>
    
                <div className="mt-6">
                    <Button 
                        onClick={() => handleFinishAuction()} 
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
                    >
                        Finish Auction
                    </Button>
                </div>
            </main>
        </div>
    );
    
}