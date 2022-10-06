import {Timestamp} from "./Timestamp";

export interface BlacklistedUser {
    uid: string;
    nickname: string;
    reason: string;
    sourceUid: string;
    createdAt: Timestamp;
}
