import { model, belongsTo, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-component-history";

import {
    UserRole,
    UserRoleWithRelations,
    RolePermission,
    RolePermissionWithRelations,
} from "./";

@model({ settings: {} })
export class Role extends HistoryEntity {
    @belongsTo(() => Role, { keyFrom: "parentId", keyTo: "id" })
    parentId: string;

    @hasMany(() => Role, { keyFrom: "id", keyTo: "parentId" })
    childs: RoleWithRelations[];

    @hasMany(() => UserRole, { keyFrom: "id", keyTo: "roleId" })
    userRoles: UserRoleWithRelations[];

    @hasMany(() => RolePermission, { keyFrom: "id", keyTo: "roleId" })
    rolePermissions: RolePermissionWithRelations[];

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    parent: RoleWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
