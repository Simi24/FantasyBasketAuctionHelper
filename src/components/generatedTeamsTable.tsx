import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Squad } from '@/types/squad';

interface GeneratedTeamsTableProps {
  teams: Squad[] | Squad | null | undefined;
}

const GeneratedTeamsTable: React.FC<GeneratedTeamsTableProps> = ({ teams }) => {
  const [sortBy, setSortBy] = useState<'role' | 'cost' | 'pdk' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!teams) {
    console.log('No teams data received');
    return <p>No teams generated yet.</p>;
  }

  const teamsArray = Array.isArray(teams) ? teams : [teams];

  // Funzione per ordinare i giocatori
  const sortPlayers = (players: any[], sortBy: 'role' | 'cost' | 'pdk', sortDirection: 'asc' | 'desc') => {
    return [...players].sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;

      if (sortBy === 'role') {
        compareA = a.position;
        compareB = b.position;
      } else if (sortBy === 'cost') {
        compareA = a.cost;
        compareB = b.cost;
      } else if (sortBy === 'pdk') {
        compareA = a.predicted_pdk;
        compareB = b.predicted_pdk;
      } else {
        return 0;
      }

      if (typeof compareA === 'string' && typeof compareB === 'string') {
        return sortDirection === 'asc' ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
      } else if (typeof compareA === 'number' && typeof compareB === 'number') {
        return sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
      }

      return 0;
    });
  };

  // Gestione click per ordinamento
  const handleSort = (column: 'role' | 'cost' | 'pdk') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      {teamsArray.map((team, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>Team {team.squad_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                    Role {sortBy === 'role' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead onClick={() => handleSort('cost')} className="cursor-pointer">
                    Cost {sortBy === 'cost' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead onClick={() => handleSort('pdk')} className="cursor-pointer">
                    Predicted PDK {sortBy === 'pdk' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortPlayers(team.players, sortBy || 'role', sortDirection).map((player, playerIndex) => (
                  <TableRow key={playerIndex}>
                    <TableCell>{`${player.first_name} ${player.last_name}`}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.cost.toFixed(2)}</TableCell>
                    <TableCell>{player.predicted_pdk.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between text-sm font-medium">
              <span>Total Cost: {team.total_cost.toFixed(2)}</span>
              <span>Total Predicted PDK: {team.total_predicted_pdk.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default GeneratedTeamsTable;
