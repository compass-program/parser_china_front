import { useStore } from 'vuex';

export const fetchColorHistory = async (site: string, league: string, opponent_0: string, opponent_1: string) => {
	try {
	  const response = await fetch(`${import.meta.env.VITE_API_URL}/get-game/${site}/${league}/${opponent_0}/${opponent_1}`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
  
	  const data = await response.json(); 
	  return data.games; 
	} catch (error) {
	  console.error('Error fetching color history:', error);
	  throw error;
	}
};

interface Params{
	site: string, league: string, opponent_0: string, opponent_1: string, bet: string, bet_filter: string
}

export const fetchBetHistroy = async(params: Params)=>{

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/get-bet/?league_name=${params.league}&match_name=${params.opponent_0+'-'+params.opponent_1}&bookmaker=${params.site}&bet_type=${params.bet}&bet_filter=${params.bet_filter}`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			},
		})
		const data = await response.json()

		return data.coeff_history
	} catch (error) {
		console.error('Error fetching bet history:', error);
	  throw error;
	}
}

export const fetchGameHistory = async(league: string, match: string)=>{
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/get-match-history/?league_name=${league}&match_name=${match}`,{ 
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			},
		})
		const data = await response.json()
		return data.history
	} catch (error) {
		console.error('Error fetching game history', error)
	}
}