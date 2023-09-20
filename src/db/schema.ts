import { ObjectId } from "mongodb";

export interface Party {
  _id: ObjectId;
  uid: string;
  prefs: string[];
  names: string;
}

export interface Mentee extends Party {
  project: string;
}

export interface Mentor extends Party {
  company: string;
}

export interface MymEvent {
  _id: ObjectId;
  name: string;
  uid: string;
  mentors: Party[];
  mentees: Party[];
}
