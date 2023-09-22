import { ObjectId } from "mongodb";

export type PartySide = 'mentor' | 'mentee';

export interface Identifiable {
  _id: string;
}

export interface PartyBase extends Identifiable {
  eventId: string;
  uid: string;
  side: PartySide;
  names: string;
  index: number;
  pairedWith: number;
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

export interface MymEvent extends Identifiable {
  name: string;
  uid: string;
  status: 'readyToStart' | 'inProgress' | 'finished';
  mentors: Mentor[];
  mentees: Mentee[];
}
