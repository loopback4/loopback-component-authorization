import { InvocationContext } from "@loopback/context";
import { Class } from "@loopback/repository";
import { Ctor } from "loopback-component-history";

import { User, Role, Permission, UserRole, RolePermission } from "./models";

/**
 * interface definition of PermissionsList class
 */
export class PermissionsList {
    // KEY = "Description";
}

/**
 * interface definition of a function which accepts a request
 * and authorizes user
 */
export interface AuthorizeFn<Permissions extends PermissionsList> {
    (permissions: StringKey<Permissions>[], methodArgs: any[]): Promise<void>;
}

/**
 * interface definition of a function which accepts a user id
 * and finds it's permission
 */
export interface GetUserPermissionsFn<Permissions extends PermissionsList> {
    (id: string): Promise<StringKey<Permissions>[]>;
}

/**
 * Authorizer `Condition` type system and authorization metadata
 */
export type Condition<Permissions extends PermissionsList> =
    | And<Permissions>
    | Or<Permissions>
    | FullKey<Permissions>
    | Key<Permissions>;
export type And<Permissions extends PermissionsList> = {
    and: Condition<Permissions>[];
};
export type Or<Permissions extends PermissionsList> = {
    or: Condition<Permissions>[];
};
export type FullKey<Permissions extends PermissionsList> = {
    key: Key<Permissions>;
    not?: true;
};
export type Key<Permissions extends PermissionsList> =
    | StringKey<Permissions>
    | AsyncKey;
export type StringKey<Permissions extends PermissionsList> = keyof Permissions;
export type AsyncKey = (
    invocationContext: InvocationContext
) => Promise<boolean>;

/**
 * AuthorizationMixin configs
 */
export interface AuthorizationMixinConfig {
    permissions?: Class<PermissionsList>;
    userModel?: Ctor<User>;
    roleModel?: Ctor<Role>;
    permissionModel?: Ctor<Permission>;
    userRoleModel?: Ctor<UserRole>;
    rolePermissionModel?: Ctor<RolePermission>;
}
