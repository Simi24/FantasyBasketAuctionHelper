import React, { useState, useEffect, useCallback } from 'react';
import { NavProps } from "@/types/navigationProps";
import { Button } from "./ui/button";
import Team from "./team";
import CommunicationController from '@/model/CommunicationController';
import { Squad } from '@/types/squad';
import GeneratedTeamsTable from './generatedTeamsTable';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

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
                console.log('availablePlayersList in auction component:', availablePlayersList);
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
            handleNavigation('home');
        }
        catch (error) {
            console.error('Error finishing auction:', error);
        }
      }, [communicationController]);

    const handleGenerateTeam = useCallback(async () => {
        try {
                const teams: Squad[] = await communicationController.generateSquads();
                console.log('teams generated:', teams);
                setGeneratedTeams(teams);
        }
        catch (error) {
                console.error('Error finishing auction:', error);
        }
    }, [communicationController]);

      const getAvailablePlayers = useCallback(async () => {
        try {
          const players = await communicationController.availablePlayers();
          console.log('players:', players);
          setAvailablePlayers(players);
          window.localStorage.setItem('availablePlayers', JSON.stringify(players));
        } catch (error) {
          console.error('Error fetching available players:', error);
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
                        availablePlayersProps={availablePlayers}
                        onTeamUpdate={handleTeamUpdate}
                    />
                </div>

                <div className="lg:w-1/2 bg-red-500">
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGenerateTeam} className="mb-4">Generate Teams</Button>
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
                <Button onClick={() => handleFinishAuction()}>Termina Asta</Button>
            </div>
        </div>
    );
}