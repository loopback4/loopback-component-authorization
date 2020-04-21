import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    HasManyRepositoryFactory,
    DefaultCrudRepository,
} from "@loopback/repository";
import { Ctor } from "loopback-component-history";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings,
} from "../keys";

import { Permission, PermissionRelations, RolePermission } from "../models";

import { DefaultRolePermissionRepository } from "./";

/**
 * Repository Type
 */
export interface PermissionRepository<
    Model extends Permission,
    ModelRelations extends PermissionRelations
>
    extends DefaultCrudRepository<
        Model,
        typeof Permission.prototype.id,
        ModelRelations
    > {
    readonly rolePermissions: HasManyRepositoryFactory<
        RolePermission,
        typeof Permission.prototype.id
    >;
}

/**
 * Repository Mixin
 */
export function PermissionRepositoryMixin<
    Model extends Permission,
    ModelRelations extends PermissionRelations
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
    ): RepositoryClass & Class<PermissionRepository<Model, ModelRelations>> {
        const parentClass: Class<DefaultCrudRepository<
            Model,
            string,
            ModelRelations
        >> = superClass || DefaultCrudRepository;

        @bindAuthorization("PermissionRepository")
        class Repository extends parentClass
            implements PermissionRepository<Model, ModelRelations> {
            public readonly rolePermissions: HasManyRepositoryFactory<
                RolePermission,
                typeof Permission.prototype.id
            >;

            constructor(
                @inject(PrivateAuthorizationBindings.PERMISSION_MODEL)
                ctor: Ctor<Model>,
                @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
                dataSource: juggler.DataSource,
                @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
                getRolePermissionRepository: Getter<
                    DefaultRolePermissionRepository
                >
            ) {
                super(ctor, dataSource);

                this.rolePermissions = this.createHasManyRepositoryFactoryFor(
                    "rolePermissions",
                    getRolePermissionRepository
                );
                this.registerInclusionResolver(
                    "rolePermissions",
                    this.rolePermissions.inclusionResolver
                );
            }
        }

        return Repository as any;
    };
}

/**
 * Repository Class
 */
export class DefaultPermissionRepository extends PermissionRepositoryMixin<
    Permission,
    PermissionRelations
>()() {}
