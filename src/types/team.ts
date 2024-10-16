import { Player } from "./player";

export interface Team {
    my_team: Player[];
    remaining_budget: number;
    opponent_teams: { [key: string]: Player[] };
}