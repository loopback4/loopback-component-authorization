import { model, belongsTo } from "@loopback/repository";
import { HistoryEntity } from "loopback-component-history";

import {
    Role,
    RoleWithRelations,
    Permission,
    PermissionWithRelations,
} from "./";

@model({ settings: {} })
export class RolePermission extends HistoryEntity {
    @belongsTo(() => Role, { keyFrom: "roleId", keyTo: "id" })
    roleId: string;

    @belongsTo(() => Permission, { keyFrom: "permissionId", keyTo: "id" })
    permissionId: string;

    constructor(data?: Partial<RolePermission>) {
        super(data);
    }
}

export interface RolePermissionRelations {
    role: RoleWithRelations;
    permission: PermissionWithRelations;
}

export type RolePermissionWithRelations = RolePermission &
    RolePermissionRelations;
