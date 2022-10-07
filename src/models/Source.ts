import {Timestamp} from "./Timestamp";

export interface SourceType{
    uid: string;
    name: string;
    userUid: string;
    createdAt: Timestamp;
    usersCount: number;
}
