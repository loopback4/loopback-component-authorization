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

import { UserRole, UserRoleRelations, User, Role } from "../models";

import { DefaultUserRepository, DefaultRoleRepository } from "./";

/**
 * Repository Type
 */
export interface UserRoleRepository<
    Model extends UserRole,
    ModelRelations extends UserRoleRelations
>
    extends DefaultCrudRepository<
        Model,
        typeof UserRole.prototype.id,
        ModelRelations
    > {
    readonly user: BelongsToAccessor<User, typeof UserRole.prototype.id>;

    readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;
}

/**
 * Repository Mixin
 */
export function UserRoleRepositoryMixin<
    Model extends UserRole,
    ModelRelations extends UserRoleRelations
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
    ): RepositoryClass & Class<UserRoleRepository<Model, ModelRelations>> {
        const parentClass: Class<DefaultCrudRepository<
            Model,
            string,
            ModelRelations
        >> = superClass || DefaultCrudRepository;

        @bindAuthorization("UserRoleRepository")
        class Repository extends parentClass
            implements UserRoleRepository<Model, ModelRelations> {
            public readonly user: BelongsToAccessor<
                User,
                typeof UserRole.prototype.id
            >;

            public readonly role: BelongsToAccessor<
                Role,
                typeof UserRole.prototype.id
            >;

            constructor(
                @inject(PrivateAuthorizationBindings.USER_ROLE_MODEL)
                ctor: Ctor<Model>,
                @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
                dataSource: juggler.DataSource,
                @inject.getter(AuthorizationBindings.USER_REPOSITORY)
                getUserRepository: Getter<DefaultUserRepository>,
                @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
                getRoleRepository: Getter<DefaultRoleRepository>
            ) {
                super(ctor, dataSource);

                this.user = this.createBelongsToAccessorFor(
                    "user",
                    getUserRepository
                );
                this.registerInclusionResolver(
                    "user",
                    this.user.inclusionResolver
                );

                this.role = this.createBelongsToAccessorFor(
                    "role",
                    getRoleRepository
                );
                this.registerInclusionResolver(
                    "role",
                    this.role.inclusionResolver
                );
            }
        }

        return Repository as any;
    };
}

/**
 * Repository Class
 */
export class DefaultUserRoleRepository extends UserRoleRepositoryMixin<
    UserRole,
    UserRoleRelations
>()(HistoryCrudRepositoryMixin<UserRole, UserRoleRelations>()()) {}
