import {BlacklistedUser} from "./BlacklistedUser";

export interface SourceType{
    uid: string;
    name: string;
    user: string;
    users?: Array<BlacklistedUser>
}
