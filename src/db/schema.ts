import { ObjectId } from "mongodb";

export type PartySide = 'mentor' | 'mentee';

export interface Identifiable {
  _id: ObjectId;
}

export interface PartyStatusPrep {
  phase: 'preparation';
};

export interface PartyStatusInProgress {
  phase: 'in-progress';
};

export interface PartyStatusCommitted {
  phase: 'committed';
};

export interface PartyStatusPaired {
  phase: 'paired';
  with: number;
};

export type PartyStatus = (
  | PartyStatusPrep
  | PartyStatusInProgress
  | PartyStatusCommitted
  | PartyStatusPaired
);

export interface PartyBase extends Identifiable {
  eventId: ObjectId;
  uid: string;
  side: PartySide;
  names: string;
  index: number;
  status: PartyStatus;
  prefs: number[];
}

export interface Mentee extends PartyBase {
  side: 'mentee';
  project: string;
  prefsList: Mentor[];
}

export interface Mentor extends PartyBase {
  side: 'mentor';
  company: string;
  prefsList: Mentee[];
}

export type Party = Mentee | Mentor;

export interface FinalPairing {
  mentees: number[];
}

export interface EventStatusPrep {
  phase: 'preparation';
};

export interface EventStatusInProgress {
  phase: 'in-progress';
};

export interface EventStatusPaired {
  phase: 'finished';
  pairing: FinalPairing;
};

export type EventStatus = (
  | EventStatusPrep
  | EventStatusInProgress
  | EventStatusPaired
);

export interface MymEvent extends Identifiable {
  name: string;
  uid: string;
  size: number;
  status: EventStatus;
  mentors: Mentor[];
  mentees: Mentee[];
}
