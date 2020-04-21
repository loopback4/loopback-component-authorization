import { Context } from "@loopback/context";
import { Class, SchemaMigrationOptions } from "@loopback/repository";

import { createHash } from "crypto";

import {
    findAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { AuthorizationMixinConfig, PermissionsList } from "../types";

import { relation } from "../decorators";

import {
    User,
    UserWithRelations,
    Role,
    RoleWithRelations,
    Permission,
    PermissionWithRelations,
    UserRole,
    UserRoleWithRelations,
    RolePermission,
    RolePermissionWithRelations
} from "../models";

import {
    AuthorizeActionProvider,
    GetUserPermissionsProvider
} from "../providers";

import {
    DefaultUserRepository,
    DefaultRoleRepository,
    DefaultPermissionRepository,
    DefaultUserRoleRepository,
    DefaultRolePermissionRepository
} from "../repositories";

export function AuthorizationMixin<T extends Class<any>>(superClass: T) {
    const bootModels = (ctx: Context, configs: AuthorizationMixinConfig) => {
        let userModel = configs.userModel || User;
        let roleModel = configs.roleModel || Role;
        let permissionModel = configs.permissionModel || Permission;
        let userRoleModel = configs.userRoleModel || UserRole;
        let rolePermissionModel = configs.rolePermissionModel || RolePermission;

        /** Fix user model relations */
        relation<UserWithRelations, any>(
            "userRoles",
            () => userRoleModel
        )(userModel);

        /** Fix role model relations */
        relation<RoleWithRelations, any>(
            "userRoles",
            () => userRoleModel
        )(roleModel);
        relation<RoleWithRelations, any>(
            "rolePermissions",
            () => rolePermissionModel
        )(roleModel);

        /** Fix permission model relations */
        relation<PermissionWithRelations, any>(
            "rolePermissions",
            () => rolePermissionModel
        )(permissionModel);

        /** Fix userRole model relations */
        relation<UserRoleWithRelations, any>(
            "user",
            () => userModel
        )(userRoleModel);
        relation<UserRoleWithRelations, any>(
            "role",
            () => roleModel
        )(userRoleModel);

        /** Fix rolePermission model relations */
        relation<RolePermissionWithRelations, any>(
            "role",
            () => roleModel
        )(rolePermissionModel);
        relation<RolePermissionWithRelations, any>(
            "permission",
            () => permissionModel
        )(rolePermissionModel);

        ctx.bind(PrivateAuthorizationBindings.USER_MODEL).to(userModel);
        ctx.bind(PrivateAuthorizationBindings.ROLE_MODEL).to(roleModel);
        ctx.bind(PrivateAuthorizationBindings.PERMISSION_MODEL).to(
            permissionModel
        );
        ctx.bind(PrivateAuthorizationBindings.USER_ROLE_MODEL).to(
            userRoleModel
        );
        ctx.bind(PrivateAuthorizationBindings.ROLE_PERMISSION_MODEL).to(
            rolePermissionModel
        );
    };

    const bootProviders = (ctx: Context) => {
        ctx.bind(AuthorizationBindings.AUTHORIZE_ACTION).toProvider(
            AuthorizeActionProvider
        );
        ctx.bind(AuthorizationBindings.GET_USER_PERMISSIONS_ACTION).toProvider(
            GetUserPermissionsProvider
        );
    };

    const bootDataSources = (ctx: Context) => {
        let relationalDataSource = findAuthorization(
            ctx,
            "RelationalDataSource"
        );
        if (relationalDataSource) {
            ctx.bind(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE).to(
                relationalDataSource
            );
        }
    };

    const bootRepositories = (ctx: Context) => {
        /**
         * Find, Bind User Repository
         */
        let userRepository = findAuthorization(ctx, "UserRepository");
        if (userRepository) {
            ctx.bind(AuthorizationBindings.USER_REPOSITORY).to(userRepository);
        } else {
            ctx.bind(AuthorizationBindings.USER_REPOSITORY)
                .toClass(DefaultUserRepository)
                .tag("repository");
        }

        /**
         * Find, Bind Role Repository
         */
        let roleRepository = findAuthorization(ctx, "RoleRepository");
        if (roleRepository) {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
        } else {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY)
                .toClass(DefaultRoleRepository)
                .tag("repository");
        }

        /**
         * Find, Bind Permission Repository
         */
        let permissionRepository = findAuthorization(
            ctx,
            "PermissionRepository"
        );
        if (permissionRepository) {
            ctx.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
                permissionRepository
            );
        } else {
            ctx.bind(AuthorizationBindings.PERMISSION_REPOSITORY)
                .toClass(DefaultPermissionRepository)
                .tag("repository");
        }

        /**
         * Find, Bind UserRole Repository
         */
        let userRoleRepository = findAuthorization(ctx, "UserRoleRepository");
        if (userRoleRepository) {
            ctx.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).to(
                userRoleRepository
            );
        } else {
            ctx.bind(AuthorizationBindings.USER_ROLE_REPOSITORY)
                .toClass(DefaultUserRoleRepository)
                .tag("repository");
        }

        /**
         * Find, Bind RolePermission Repository
         */
        let rolePermissionRepository = findAuthorization(
            ctx,
            "RolePermissionRepository"
        );
        if (rolePermissionRepository) {
            ctx.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY).to(
                rolePermissionRepository
            );
        } else {
            ctx.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
                .toClass(DefaultRolePermissionRepository)
                .tag("repository");
        }
    };

    return class extends superClass {
        public authorizationConfigs: AuthorizationMixinConfig = {};

        async boot() {
            await super.boot();

            bootModels(this as any, this.authorizationConfigs);
            bootProviders(this as any);
            bootDataSources(this as any);
            bootRepositories(this as any);
        }

        async migrateSchema(
            options: SchemaMigrationOptions = {}
        ): Promise<void> {
            await super.migrateSchema(options);

            /**
             * Create default permissions object
             */
            const AuthorizationPermissions =
                this.authorizationConfigs.permissions || PermissionsList;
            const permissions = new AuthorizationPermissions();

            /**
             * Get permissions repository
             */
            const permissionRepository = this.getSync(
                AuthorizationBindings.PERMISSION_REPOSITORY
            );

            /**
             * Migrate permissions
             *
             * 1. id: hash(key)
             * 2. key: key
             * 3. description: description
             */
            await permissionRepository.deleteAll({
                id: {
                    inq: Object.keys(permissions).map(permissionKey =>
                        createHash("md5")
                            .update(permissionKey)
                            .digest("hex")
                    )
                }
            });
            await permissionRepository.createAll(
                Object.keys(permissions).map(
                    permissionKey =>
                        new Permission({
                            id: createHash("md5")
                                .update(permissionKey)
                                .digest("hex"),
                            key: permissionKey,
                            description: (permissions as any)[permissionKey]
                        })
                )
            );
        }
    };
}
