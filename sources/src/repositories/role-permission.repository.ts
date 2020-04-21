import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    BelongsToAccessor,
    DefaultCrudRepository,
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-component-history";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings,
} from "../keys";

import {
    RolePermission,
    RolePermissionRelations,
    Role,
    Permission,
} from "../models";

import { DefaultRoleRepository, DefaultPermissionRepository } from "./";

/**
 * Repository Type
 */
export interface RolePermissionRepository<
    Model extends RolePermission,
    ModelRelations extends RolePermissionRelations
>
    extends DefaultCrudRepository<
        Model,
        typeof RolePermission.prototype.id,
        ModelRelations
    > {
    readonly role: BelongsToAccessor<Role, typeof RolePermission.prototype.id>;

    readonly permission: BelongsToAccessor<
        Permission,
        typeof RolePermission.prototype.id
    >;
}

/**
 * Repository Mixin
 */
export function RolePermissionRepositoryMixin<
    Model extends RolePermission,
    ModelRelations extends RolePermissionRelations
>() {
    /**
     * Return function with generic type of repository class, returns mixed in class
     *
     * bugfix: optional type, load type from value
     */
    return function <
        RepositoryClass extends Class<
            DefaultCrudRepository<Model, string, ModelRelations>
        >
    >(
        superClass?: RepositoryClass
    ): RepositoryClass &
        Class<RolePermissionRepository<Model, ModelRelations>> {
        const parentClass: Class<DefaultCrudRepository<
            Model,
            string,
            ModelRelations
        >> = superClass || DefaultCrudRepository;

        @bindAuthorization("RolePermissionRepository")
        class Repository extends parentClass
            implements RolePermissionRepository<Model, ModelRelations> {
            public readonly role: BelongsToAccessor<
                Role,
                typeof RolePermission.prototype.id
            >;

            public readonly permission: BelongsToAccessor<
                Permission,
                typeof RolePermission.prototype.id
            >;

            constructor(
                @inject(PrivateAuthorizationBindings.ROLE_PERMISSION_MODEL)
                ctor: Ctor<Model>,
                @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
                dataSource: juggler.DataSource,
                @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
                getRoleRepository: Getter<DefaultRoleRepository>,
                @inject.getter(AuthorizationBindings.PERMISSION_REPOSITORY)
                getPermissionRepository: Getter<DefaultPermissionRepository>
            ) {
                super(ctor, dataSource);

                this.role = this.createBelongsToAccessorFor(
                    "role",
                    getRoleRepository
                );
                this.registerInclusionResolver(
                    "role",
                    this.role.inclusionResolver
                );

                this.permission = this.createBelongsToAccessorFor(
                    "permission",
                    getPermissionRepository
                );
                this.registerInclusionResolver(
                    "permission",
                    this.permission.inclusionResolver
                );
            }
        }

        return Repository as any;
    };
}

/**
 * Repository Class
 */
export class DefaultRolePermissionRepository extends RolePermissionRepositoryMixin<
    RolePermission,
    RolePermissionRelations
>()(HistoryCrudRepositoryMixin<RolePermission, RolePermissionRelations>()()) {}
