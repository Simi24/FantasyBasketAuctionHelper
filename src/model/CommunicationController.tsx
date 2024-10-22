import axios, { AxiosInstance } from 'axios';
import { Squad } from '../types/squad';
import { Team } from '../types/team';

class CommunicationController {
  private api: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:5000') {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async initialize(opponentNames: string[], budget: Number): Promise<{ message: string }> {
    try {
      console.log('opponentNames in initialize:', opponentNames);
      const response = await this.api.post<{ message: string }>('/initialize', { opponent_names: opponentNames, budget: budget });
      return response.data;
    } catch (error) {
      console.error('Error initializing:', error);
      throw error;
    }
  }

  async finishAuction(): Promise<{ message: string }> {
    try {
      const response = await this.api.post<{ message: string }>('/finish');
      return response.data;
    } catch (error) {
      console.error('Error finishing auction:', error);
      throw error;
    }
  }

  async buyPlayer(playerName: string, cost: number): Promise<{ message: string; remaining_budget: number, predicted_pdk: number, role: string }> {
    try {
      const response = await this.api.post<{ message: string; remaining_budget: number, predicted_pdk: number, role: string }>('/buy', { player_name: playerName, cost: cost });
      return response.data;
    } catch (error) {
      console.error('Error buying player:', error);
      throw error;
    }
  }

  async opponentPick(playerName: string, opponentName: string, cost: number): Promise<{ message: string, opponent_remaining_budget: number, predicted_pdk: number, role: string }> {
    try {
      const response = await this.api.post<{ message: string, opponent_remaining_budget: number, predicted_pdk: number, role: string }>('/opponent', {
        player_name: playerName,
        opponent_name: opponentName,
        cost: cost
      });
      return response.data;
    } catch (error) {
      console.error('Error registering opponent pick:', error);
      throw error;
    }
  }

  async generateSquads(numSquads: number = 2): Promise<Squad[]> {
    try {
      const response = await this.api.get<Squad[]>('/generate', { 
        params: { num_squads: numSquads },
        headers: {
          'Accept': 'application/json'
        }
      });

      let squads: Squad[];
      if (typeof response.data === 'string') {
        try {
          squads = JSON.parse(response.data);
        } catch (e) {
          console.error('Error parsing response data:', e);
          throw e;
        }
      } else {
        squads = response.data;
      }

      if (!Array.isArray(squads)) {
        throw new Error('Expected squads to be an array');
      }
      
      squads.forEach((squad, index) => {
        if (!squad.players || !Array.isArray(squad.players)) {
          throw new Error(`Invalid squad structure at index ${index}`);
        }
      });
      
      return squads;
    } catch (error) {
      console.error('Error generating squads:', error);
      throw error;
    }
  }

  async getTeamInfo(): Promise<Team> {
    try {
      const response = await this.api.get<Team>('/team');
      return response.data;
    } catch (error) {
      console.error('Error getting team info:', error);
      throw error;
    }
  }

  //"total_cost": 165.58,
  // The return total cost is the total cost computed using the predicted value of the model
  async availablePlayers(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>('/available');
      return response.data;
    } catch (error) {
      console.error('Error getting available players:', error);
      throw error;
    }
  }
}

export default CommunicationController;