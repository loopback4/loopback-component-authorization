import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    HasManyRepositoryFactory,
    DefaultCrudRepository,
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-component-history";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings,
} from "../keys";

import { User, UserRelations, UserRole } from "../models";

import { DefaultUserRoleRepository } from "./";

/**
 * Repository Type
 */
export interface UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
>
    extends DefaultCrudRepository<
        Model,
        typeof User.prototype.id,
        ModelRelations
    > {
    readonly userRoles: HasManyRepositoryFactory<
        UserRole,
        typeof User.prototype.id
    >;
}

/**
 * Repository Mixin
 */
export function UserRepositoryMixin<
    Model extends User,
    ModelRelations extends UserRelations
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
    ): RepositoryClass & Class<UserRepository<Model, ModelRelations>> {
        const parentClass: Class<DefaultCrudRepository<
            Model,
            string,
            ModelRelations
        >> = superClass || DefaultCrudRepository;

        @bindAuthorization("UserRepository")
        class Repository extends parentClass
            implements UserRepository<Model, ModelRelations> {
            public readonly userRoles: HasManyRepositoryFactory<
                UserRole,
                typeof User.prototype.id
            >;

            constructor(
                @inject(PrivateAuthorizationBindings.USER_MODEL)
                ctor: Ctor<Model>,
                @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
                dataSource: juggler.DataSource,
                @inject.getter(AuthorizationBindings.USER_ROLE_REPOSITORY)
                getUserRoleRepository: Getter<DefaultUserRoleRepository>
            ) {
                super(ctor, dataSource);

                this.userRoles = this.createHasManyRepositoryFactoryFor(
                    "userRoles",
                    getUserRoleRepository
                );
                this.registerInclusionResolver(
                    "userRoles",
                    this.userRoles.inclusionResolver
                );
            }
        }

        return Repository as any;
    };
}

/**
 * Repository Class
 */
export class DefaultUserRepository extends UserRepositoryMixin<
    User,
    UserRelations
>()(HistoryCrudRepositoryMixin<User, UserRelations>()()) {}
