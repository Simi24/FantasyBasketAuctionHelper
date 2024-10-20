import { Player } from "./player";

export interface Squad {
  players: Player[];
  squad_number: number;
  total_cost: number;
  total_predicted_pdk: number;
}
  