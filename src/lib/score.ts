import { Pairing } from 'stable-marriages';

export interface ScoredPairing {
  pairing: Pairing;
  regret: number;
  diff: number;
}

export const scorePairing = (pairing: Pairing): ScoredPairing => {
  let regret = 0;

  for (const x of pairing.scoresM) {
    if (x > regret) {
      regret = x;
    }
  }

  for (const y of pairing.scoresW) {
    if (y > regret) {
      regret = y;
    }
  }

  return {
    pairing: pairing,
    regret,
    diff: Math.abs(pairing.totalM - pairing.totalW),
  };
};

export const scorePairings = (pairings: Pairing[]): ScoredPairing[] => {
  return pairings.map(scorePairing);
}

const filterRegret = (scores: ScoredPairing[]): ScoredPairing[] => {
  let minRegret = Infinity;

  for (const score of scores) {
    if (score.regret < minRegret) {
      minRegret = score.regret;
    }
  }

  return scores.filter((score) => score.regret === minRegret);
};

const filterFairness = (scores: ScoredPairing[]): ScoredPairing[] => {
  let minDiff = Infinity;

  for (const score of scores) {
    if (score.diff < minDiff) {
      minDiff = score.diff;
    }
  }

  return scores.filter((score) => score.diff === minDiff);
};

const filterHapiness = (scores: ScoredPairing[]): ScoredPairing[] => {
  let maxTotal = -Infinity;

  for (const score of scores) {
    if (score.pairing.total > maxTotal) {
      maxTotal = score.pairing.total;
    }
  }

  return scores.filter((score) => score.pairing.total === maxTotal);
};

const filterMentors = (scores: ScoredPairing[]): ScoredPairing[] => {
  let maxMentors = -Infinity;

  for (const score of scores) {
    if (score.pairing.totalM > maxMentors) {
      maxMentors = score.pairing.total;
    }
  }

  return scores.filter((score) => score.pairing.total === maxMentors);
};

export const findBest = (stage0: ScoredPairing[]): ScoredPairing => {
  const stage1 = filterRegret(stage0);
  const stage2 = filterFairness(stage1);
  const stage3 = filterHapiness(stage2);
  const stage4 = filterMentors(stage3);
  return stage4[0];
};

