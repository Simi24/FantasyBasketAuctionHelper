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

  async initialize(opponentNames: string[]): Promise<{ message: string }> {
    try {
      console.log('opponentNames in initialize:', opponentNames);
      const response = await this.api.post<{ message: string }>('/initialize', { opponent_names: opponentNames });
      return response.data;
    } catch (error) {
      console.error('Error initializing:', error);
      throw error;
    }
  }

  async buyPlayer(playerName: string, cost: number): Promise<{ message: string; remaining_budget: number }> {
    try {
      const response = await this.api.post<{ message: string; remaining_budget: number }>('/buy', { player_name: playerName, cost: cost });
      return response.data;
    } catch (error) {
      console.error('Error buying player:', error);
      throw error;
    }
  }

  async opponentPick(playerName: string, opponentName: string): Promise<{ message: string }> {
    try {
      const response = await this.api.post<{ message: string }>('/opponent', { player_name: playerName, opponent_name: opponentName });
      return response.data;
    } catch (error) {
      console.error('Error registering opponent pick:', error);
      throw error;
    }
  }

  async generateSquads(numSquads: number = 3): Promise<Squad[]> {
    try {
      const response = await this.api.get<Squad[]>('/generate', { params: { num_squads: numSquads } });
      return response.data;
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
}

export default CommunicationController;