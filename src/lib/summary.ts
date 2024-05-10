import { FinalPairing, MymEvent } from "db/schema";

export interface Stats {
  readonly median: number;
  readonly iqr: number;
}

export interface Pupularities {
  readonly mentees: readonly Stats[];
  readonly mentors: readonly Stats[];
}

const median = (arr: number[]): number => {
  const sorted = arr.toSorted((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

const iqr = (arr: number[]): number => {
  const sorted = arr.toSorted((a, b) => a - b);
  const q1 = median(sorted.slice(0, Math.floor(arr.length / 2)));
  const q3 = median(sorted.slice(Math.ceil(arr.length / 2)));
  return q3 - q1;
}

export const computePopularities = (event: MymEvent): Pupularities => {
  const mentees: Stats[] = [];
  const mentors: Stats[] = [];

  for (let i = 0; i < event.size; i++) {
    const menteePrefIndices = event.mentors.map(
      (mentor) => mentor.prefs.findIndex((p) => p === i) + 1
    );
    mentees.push({ median: median(menteePrefIndices), iqr: iqr(menteePrefIndices) });

    const mentorPrefIndices = event.mentees.map(
      (mentee) => mentee.prefs.findIndex((p) => p === i) + 1
    );
    mentors.push({ median: median(mentorPrefIndices), iqr: iqr(mentorPrefIndices) });
  }

  return { mentees, mentors };
}

export const getCommittedCount = (event: MymEvent): number => {
  const mentorsFilled = event.mentors.filter(
    (mentor) => mentor.status.phase === 'committed'
  ).length;

  const menteesFilled = event.mentees.filter(
    (mentee) => mentee.status.phase === 'committed'
  ).length;

  return mentorsFilled + menteesFilled;
};

export interface PairingSummary {
  menteeScores: number[];
  mentorScores: number[];
  menteesOverallScore: number;
  mentorsOverallScore: number;
  overallScore: number;
  regret: number;
  fairness: number;
}

export const computePairingSummary = (event: MymEvent, pairing: FinalPairing): PairingSummary => {
  const mentorScores: number[] = [];
  const menteeScores: number[] = [];

  pairing.mentees.forEach((menteeIndex, mentorIndex) => {
    const mentor = event.mentors[mentorIndex];
    const mentorScore = mentor.prefs.findIndex((p) => p === menteeIndex) + 1;
    mentorScores.push(mentorScore);

    const mentee = event.mentees[menteeIndex];
    const menteeScore = mentee.prefs.findIndex((p) => p === mentorIndex) + 1;
    menteeScores[menteeIndex] = menteeScore;
  });

  const menteesOverallScore = menteeScores.reduce((a, b) => a + b, 0);
  const mentorsOverallScore = mentorScores.reduce((a, b) => a + b, 0);
  const overallScore = menteesOverallScore + mentorsOverallScore;

  const regret = Math.max(...menteeScores, ...mentorScores);
  const fairness = Math.abs(menteesOverallScore - mentorsOverallScore);

  return {
    menteeScores,
    mentorScores,
    menteesOverallScore,
    mentorsOverallScore,
    overallScore,
    regret,
    fairness,
  };
}
