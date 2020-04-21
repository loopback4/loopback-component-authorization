import { model, belongsTo } from "@loopback/repository";
import { HistoryEntity } from "loopback-component-history";

import { User, UserWithRelations, Role, RoleWithRelations } from "./";

@model({ settings: {} })
export class UserRole extends HistoryEntity {
    @belongsTo(() => User, { keyFrom: "userId", keyTo: "id" })
    userId: string;

    @belongsTo(() => Role, { keyFrom: "roleId", keyTo: "id" })
    roleId: string;

    constructor(data?: Partial<UserRole>) {
        super(data);
    }
}

export interface UserRoleRelations {
    user: UserWithRelations;
    role: RoleWithRelations;
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
