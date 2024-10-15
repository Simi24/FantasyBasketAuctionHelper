import { Player } from "./player";

export interface Squad {
    squad_number: number;
    players: Player[];
    total_cost: number;
    total_predicted_pdk: number;
  }
  