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
	site: string, league: string, opponent_0: string, opponent_1: string, bet: string
}

export const fetchBetHistroy = async(params: Params)=>{
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/get-game-bets/${params.site}/${params.league}?match=${params.opponent_0+':'+params.opponent_1}&bet=${params.bet}`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			},
		})
		const data = await response.json()
		return data[params.opponent_0+':'+params.opponent_1]
	} catch (error) {
		console.error('Error fetching bet history:', error);
	  throw error;
	}
}