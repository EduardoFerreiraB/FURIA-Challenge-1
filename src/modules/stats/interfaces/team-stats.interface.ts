export interface TeamStats {
  mapsPlayed: number;
  wdl: number[];
  totalKills: number;
  totalDeaths: number;
  roundsPlayed: number;
  kdRatio: number;
  winRate: number;
}

export interface PlayerStats {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  rating: number;
  kdRatio: number;
  headshotPercentage: number;
  roundsPlayed: number;
  killsPerRound: number;
  deathsPerRound: number;
  assistsPerRound: number;
  impact: number;
  adr: number;
}
