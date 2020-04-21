import { bind, Context, BindingKey, MetadataAccessor } from "@loopback/context";
import { juggler } from "@loopback/repository";
import { Ctor } from "loopback-component-history";

import { PermissionsList, AuthorizeFn, GetUserPermissionsFn } from "./types";

import { AuthorizationMetadata } from "./decorators";

import { User, Role, Permission, UserRole, RolePermission } from "./models";

import {
    DefaultUserRepository,
    DefaultRoleRepository,
    DefaultPermissionRepository,
    DefaultUserRoleRepository,
    DefaultRolePermissionRepository,
} from "./repositories";

/**
 * Public bindings used in application scope
 */
export namespace AuthorizationBindings {
    /**
     * Action Provider key: output
     *  1. AuthorizeFn
     *  2. GetUserPermissionsFn
     */
    export const AUTHORIZE_ACTION = BindingKey.create<
        AuthorizeFn<PermissionsList>
    >("authorization.providers.authorize");
    export const GET_USER_PERMISSIONS_ACTION = BindingKey.create<
        GetUserPermissionsFn<PermissionsList>
    >("authorization.providers.getUserPermissions");

    /**
     * Base Repository key:
     *
     * 1. UserRepository
     * 2. RoleRepository
     * 3. PermissionRepository
     * 4. UserRoleRepository
     * 5. RolePermissionRepository
     */
    export const USER_REPOSITORY = BindingKey.create<DefaultUserRepository>(
        "authorization.repositories.user"
    );
    export const ROLE_REPOSITORY = BindingKey.create<DefaultRoleRepository>(
        "authorization.repositories.role"
    );
    export const PERMISSION_REPOSITORY = BindingKey.create<
        DefaultPermissionRepository
    >("authorization.repositories.permission");
    export const USER_ROLE_REPOSITORY = BindingKey.create<
        DefaultUserRoleRepository
    >("authorization.repositories.userRole");
    export const ROLE_PERMISSION_REPOSITORY = BindingKey.create<
        DefaultRolePermissionRepository
    >("authorization.repositories.rolePermission");
}

/**
 * Private binding used in component scope
 */
export namespace PrivateAuthorizationBindings {
    /**
     * Model key:
     *
     * 1. UserModel
     * 2. RoleModel
     * 3. PermissionModel
     * 4. UserRoleModel
     * 5. RolePermissionModel
     */
    export const USER_MODEL = BindingKey.create<Ctor<User>>(
        "private.authorization.models.user"
    );
    export const ROLE_MODEL = BindingKey.create<Ctor<Role>>(
        "private.authorization.models.role"
    );
    export const PERMISSION_MODEL = BindingKey.create<Ctor<Permission>>(
        "private.authorization.models.permission"
    );
    export const USER_ROLE_MODEL = BindingKey.create<Ctor<UserRole>>(
        "private.authorization.models.userRole"
    );
    export const ROLE_PERMISSION_MODEL = BindingKey.create<
        Ctor<RolePermission>
    >("private.authorization.models.rolePermission");

    /**
     * DataSource key
     *
     * 1. RelationalDataSource: RDBMS
     */
    export const RELATIONAL_DATASOURCE = BindingKey.create<juggler.DataSource>(
        "private.authorization.dataSources.relational"
    );
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata<PermissionsList>,
    MethodDecorator
>("authorization.operationsMetadata");

/**
 * Binding, Finding key
 *
 * 1. RelationalDataSource
 *
 * 2. UserRepository
 * 3. RoleRepository
 * 4. PermissionRepository
 * 5. UserRoleRepository
 * 6. RolePermissionRepository
 */
export type BindAuthorizationKey =
    | "RelationalDataSource"
    | "UserRepository"
    | "RoleRepository"
    | "PermissionRepository"
    | "UserRoleRepository"
    | "RolePermissionRepository";
export function bindAuthorization(key: BindAuthorizationKey) {
    return bind((binding) => {
        binding.tag({
            authorization: true,
            authorizationKey: key,
        });

        return binding;
    });
}
export function findAuthorization(ctx: Context, key: BindAuthorizationKey) {
    const binding = ctx.findByTag({
        authorization: true,
        authorizationKey: key,
    })[0];

    if (binding) {
        return binding.getValue(ctx);
    }
}

/** bindRelationalDataSource */
export function bindRelationalDataSource() {
    return bindAuthorization("RelationalDataSource");
}
