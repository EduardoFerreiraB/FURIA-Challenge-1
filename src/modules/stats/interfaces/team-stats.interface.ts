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
  totalKills: number;
  headshotPercentage: number;
  totalDeaths: number;
  kdRatio: number;
  damagePerRound: number;
  grenadeDamagePerRound: number;
  mapsPlayed: number;
  roundsPlayed: number;
  killsPerRound: number;
  assistsPerRound: number;
  deathsPerRound: number;
  rating: number;
}
