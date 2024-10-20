import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Squad } from '@/types/squad';

interface GeneratedTeamsTableProps {
    teams: Squad[] | Squad | null | undefined;
  }
  
  const GeneratedTeamsTable: React.FC<GeneratedTeamsTableProps> = ({ teams }) => {
    if (!teams) {
      return <p>No teams generated yet.</p>;
    }
  
    const teamsArray = Array.isArray(teams) ? teams : [teams];

    console.log('teamsArray:', teamsArray);
  
    return (
      <ScrollArea className="h-[600px]">
        {teamsArray.map((team, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle>Squad {team.squad_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Predicted PDK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.players.map((player, playerIndex) => (
                    <TableRow key={playerIndex}>
                      <TableCell>{`${player.first_name} ${player.last_name}`}</TableCell>
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