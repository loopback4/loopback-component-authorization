import { model, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-component-history";

import { UserRole, UserRoleWithRelations } from "./";

@model({ settings: {} })
export class User extends HistoryEntity {
    @hasMany(() => UserRole, { keyFrom: "id", keyTo: "userId" })
    userRoles: UserRoleWithRelations[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
