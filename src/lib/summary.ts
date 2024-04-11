import { FinalPairing, MymEvent } from "db/schema";

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
