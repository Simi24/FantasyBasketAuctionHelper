import { UserPlus } from "lucide-react";
import TableTeam from "./tableTeam";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Team() {

    const [remaining_budget, setRemainingBudget] = useState<number>(150);
    const [spendt_budget, setSpendtBudget] = useState<number>(0);
    const [playerName, setPlayerName] = useState<string>("");

    return (
        <div className="flex-col space-y-4">
            <div className="flex-auto">
                <h1 className="text-3xl font-bold text-blue-600 text-center">La tua Squadra</h1>
            </div>
            <div className="flex-auto">
                <div className="flex space-x-2">
                    <div className="flex-grow">
                        <span className="text-gray-500">Budget Rimanente:{ remaining_budget } </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Budget Speso: {spendt_budget} </span>
                    </div>
                </div>
            </div>
            <div className="flex-grow">
                <TableTeam />
            </div>
            <div className="flex-auto">
                <div className="flex-grow">
                    <h3 className="text-gray-500 text-right">Tot PDK: {spendt_budget} </h3>
                </div>
            </div>
            <div className="flex-auto">
                <Input 
                    placeholder="Inserisci il nome del giocatore" 
                    className="flex-grow"
                />
            </div>
            <div className="flex-auto">
                <div className="flex space-x-2">
                    <Input 
                        placeholder="Prezzo Giocatore" 
                        className="flex-grow"
                    />
                    <Button className="bg-green-500 hover:bg-green-600">
                        <UserPlus className="mr-2 h-4 w-4" /> Aggiungi
                    </Button>
                </div>
            </div>
        </div>
    )
}