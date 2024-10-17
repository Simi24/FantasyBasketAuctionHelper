import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import CommunicationController from '@/model/CommunicationController';

interface Player {
  first_name: string;
  last_name: string;
  role: string;
  cost: number;
  predicted_pdk: number;
}

interface TeamProps {
  teamName: string;
  isMainTeam: boolean;
  communicationController: CommunicationController;
  onTeamUpdate: () => void;
}

export default function Team({ teamName, isMainTeam, communicationController, onTeamUpdate }: TeamProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number>(150);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerCost, setPlayerCost] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<string[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<string[]>([]);

  const fetchInitialTeamInfo = useCallback(async () => {
    try {
      const teamInfo = await communicationController.getTeamInfo();
      if (isMainTeam) {
        setPlayers(teamInfo.my_team as Player[]);
        setRemainingBudget(teamInfo.remaining_budget);
      } else {
        setPlayers((teamInfo.opponent_teams[teamName] || []) as Player[]);
      }
    } catch (error) {
      console.error('Error fetching initial team info:', error);
      setError('Failed to fetch initial team information.');
    }
  }, [communicationController, isMainTeam, teamName]);

  //TODO: move first getAvailablePlayers to parent component
  useEffect(() => {
    getAvailablePlayers();
  }, []);

  const getAvailablePlayers = useCallback(async () => {
    try {
      const players = await communicationController.availablePlayers();
      console.log('players:', players);
      setAvailablePlayers(players);
    } catch (error) {
      console.error('Error fetching available players:', error);
      setError('Failed to fetch available players.');
    }
  }, [communicationController]);

  useEffect(() => {
    if (playerName === '') {
      setFilteredPlayers([]);
    } else {
      const filtered = availablePlayers.filter(player =>
        player.toLowerCase().includes(playerName.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [playerName, availablePlayers]);

  const addPlayer = useCallback(async () => {
    if (!playerName || !playerCost) {
      setError('Please enter both player name and cost.');
      return;
    }

    const cost = parseFloat(playerCost);
    if (isNaN(cost) || cost <= 0) {
      setError('Please enter a valid positive number for cost.');
      return;
    }

    if (isMainTeam && cost > remainingBudget) {
      setError('Not enough budget to add this player.');
      return;
    }

    const [firstName, ...lastNameParts] = playerName.split(' ');
    const lastName = lastNameParts.join(' ');

    const newPlayer: Player = {
      first_name: firstName,
      last_name: lastName,
      role: 'Unknown',
      cost: cost,
      predicted_pdk: 0,
    };

    try {
      if (isMainTeam) {
        const response = await communicationController.buyPlayer(playerName, cost);
        setRemainingBudget(response.remaining_budget);
        newPlayer.predicted_pdk = response.predicted_pdk;
        newPlayer.role = response.role;
      } else {
        await communicationController.opponentPick(playerName, teamName);
        newPlayer.predicted_pdk = 0;
      }
    } catch (error) {
      console.error('Error buying player:', error);
      setError('Failed to add player. Please try again.');
      return;
    }

    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    if (isMainTeam) {
      setRemainingBudget(prevBudget => prevBudget - cost);
    }
    setPlayerName('');
    setPlayerCost('');
    setError(null);
    onTeamUpdate();
  }, [isMainTeam, onTeamUpdate, playerCost, playerName, remainingBudget]);

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold text-blue-600">{teamName}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMainTeam && (
          <div className="text-sm font-medium">
            Remaining Budget: €{remainingBudget.toFixed(2)}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>PDK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{`${player.first_name} ${player.last_name}`}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>€{player.cost.toFixed(2)}</TableCell>
                <TableCell>{player.predicted_pdk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Input
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          {filteredPlayers.length > 0 && (
            <ul className="border border-gray-200 rounded p-2">
              {filteredPlayers.map((player, index) => (
                <li key={index} className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => setPlayerName(player)}>
                  {player}
                </li>
              ))}
            </ul>
          )}
          <div className="flex space-x-2">
            <Input
              placeholder="Player Cost"
              value={playerCost}
              onChange={(e) => setPlayerCost(e.target.value)}
              type="number"
              step="0.01"
              min="0"
            />
            <Button className="bg-green-500 hover:bg-green-600" onClick={addPlayer}>
              <UserPlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-sm text-gray-500">Players: {players.length}</span>
        {isMainTeam && (
          <span className="text-sm text-gray-500">
            Budget used: {((150 - remainingBudget) / 150 * 100).toFixed(2)}%
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
