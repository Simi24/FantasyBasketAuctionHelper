import { useState, useEffect, useCallback } from 'react';
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
  availablePlayersProps: string[];
  onTeamUpdate: () => void;
}

export default function Team({ teamName, isMainTeam, communicationController, availablePlayersProps, onTeamUpdate }: TeamProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number>(150);
  const [totBudget, setTotBudget] = useState<number>(150);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerCost, setPlayerCost] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<string[]>(availablePlayersProps);
  const [filteredPlayers, setFilteredPlayers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>(''); // Stato per gestire il tipo di ordinamento
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Stato per la direzione di ordinamento

  useEffect(() => {
    let totBudget = window.localStorage.getItem('totBudget');
    if (totBudget) {
      totBudget = JSON.parse(totBudget);
      setTotBudget(Number(totBudget));
      setRemainingBudget(Number(totBudget));
    }
  } ,[]);

  useEffect(() => {
    setAvailablePlayers(availablePlayersProps);
  }, [availablePlayersProps]);
  
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

  // Funzione per ordinare i giocatori
  const sortPlayers = (players: Player[], sortBy: string, sortDirection: 'asc' | 'desc') => {
    const sortedPlayers = [...players];
    
    sortedPlayers.sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;
  
      if (sortBy === 'role') {
        compareA = a.role;
        compareB = b.role;
      } else if (sortBy === 'cost') {
        compareA = a.cost;
        compareB = b.cost;
      } else if (sortBy === 'pdk') {
        compareA = a.predicted_pdk;
        compareB = b.predicted_pdk;
      } else {
        return 0; // In caso di sortBy sconosciuto
      }
  
      // Gestione ordinamento ascendente o discendente
      if (typeof compareA === 'string' && typeof compareB === 'string') {
        return sortDirection === 'asc' ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
      } else if (typeof compareA === 'number' && typeof compareB === 'number') {
        return sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
      }
  
      return 0;
    });
  
    return sortedPlayers;
  };
  

  const sortedPlayers = sortPlayers(players, sortBy, sortDirection);

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection('asc');
    }
  };

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
        setRemainingBudget(remainingBudget - cost);
        newPlayer.predicted_pdk = response.predicted_pdk;
        newPlayer.role = response.role;
      } else {
        const response = await communicationController.opponentPick(playerName, teamName, cost);
        newPlayer.predicted_pdk = response.predicted_pdk;
        newPlayer.role = response.role;
      }
      onTeamUpdate();
    } catch (error) {
      console.error('Error buying player:', error);
      setError('Failed to add player. Please try again.');
      return;
    }

    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    setPlayerName('');
    setPlayerCost('');
    setError(null);
    onTeamUpdate();
  }, [isMainTeam, onTeamUpdate, playerCost, playerName, remainingBudget]);

  const handleSetPlayer = (player: string) => {
    const parts = player.split(' ');

    parts.pop();

    const playerName = parts.join(' ');

    setPlayerName(playerName);
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-orange-400">
      <CardHeader>
        <h2 className="text-orange-500 text-2xl font-bold">{teamName}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMainTeam && (
          <div className="text-sm font-medium">
            Remaining Budget: {remainingBudget.toFixed(2)}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Role {sortBy === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('cost')}>
                Cost {sortBy === 'cost' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('pdk')}>
                PDK {sortBy === 'pdk' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{`${player.first_name} ${player.last_name}`}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>{player.cost.toFixed(2)}</TableCell>
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
                <li key={index} className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleSetPlayer(player)}>
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
            Budget used: {((totBudget - remainingBudget) / totBudget * 100).toFixed(2)}%
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
