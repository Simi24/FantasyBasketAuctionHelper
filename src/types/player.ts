export interface Player {
  cost: number;
  first_name: string;
  last_name: string;
  normalized_pdk: number;
  position: string;
  predicted_pdk: number;
  seasons_of_data: number | null;
  team_name: string;
}