export interface RateData {
    oneXtwo_home: string;
    oneXtwo_away: string;
    oneXtwo_draw: string,
    total_point: string;
    total_bet_0: string;
    total_bet_1: string;
    handicap_point_0: string;
    handicap_bet_0: string;
    handicap_point_1: string;
    handicap_bet_1: string;
    server_time: string;
    [key: string]: string;
}


export interface LeagueData {
    is_end_game?: boolean;
    opponent_0?: string;
    opponent_1?: string;
    time_game: string;
    rate?: RateData;
    server_time: string;  
    id?: number;
    match_id?: number;
    score_game?: string;
    oneXtwo_home: string;
    oneXtwo_away: string;
    oneXtwo_draw: string,
    total_point?: string;
    total_bet_0?: string;
    total_bet_1?: string;
    handicap_point_0?: string;
    handicap_bet_0?: string;
    handicap_point_1?: string;
    handicap_bet_1?: string;
    bookmaker?: string;
    site?: string;
}

export interface LeagueStorage {
    [key: string]: {
      value: { [key: string]: LeagueData[] };
      maxLength: number;
    };
  }