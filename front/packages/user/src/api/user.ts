import { IUserInfo } from "@mnd/shared";

export class UserInfo implements IUserInfo {
    id?: string | undefined;
    username?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    emailVerified?: boolean | undefined;
    isAdmin?: boolean | undefined;
    hasUserRole: boolean
    hasDownloadRole: boolean
    hasAnalyzeRole: boolean

    constructor(info:IUserInfo) {
        this.id = info.id;
        this.username = info.username;
        this.firstName = info.firstName;
        this.lastName = info.lastName;
        this.email = info.email;
        this.emailVerified = info.emailVerified;
        this.isAdmin = info.isAdmin;
        this.hasUserRole = info.hasUserRole;
        this.hasDownloadRole = info.hasDownloadRole;
        this.hasAnalyzeRole = info.hasAnalyzeRole;
    }

    public isEqualUserId(id: string): boolean {
        if(!this.id) return false;
        return this.id === id;
    }
    public getUserNameById(id: string): string {
        if(!this.id) return '';
        return this.id === id ? this.username || '' : '';
    }
}