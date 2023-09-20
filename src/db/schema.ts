import { ObjectId } from "mongodb";

export type PartySide = 'mentor' | 'mentee';

export interface PartyBase {
  _id: ObjectId;
  uid: string;
  names: string;
  side: PartySide;
}

export interface MenteeBase extends PartyBase {
  side: 'mentee';
  project: string;
}

export interface MentorBase extends PartyBase {
  side: 'mentor';
  company: string;
}

export interface Mentee extends MenteeBase { 
  prefs: MentorBase[];
  pairedWith: number;
}

export interface Mentor extends MentorBase {
  prefs: MenteeBase[];
  pairedWith: number;
}

export type Party = Mentee | Mentor;

export interface MymEvent {
  _id: ObjectId;
  name: string;
  uid: string;
  status: 'readyToStart' | 'inProgress' | 'finished';
  mentors: Party[];
  mentees: Party[];
}
