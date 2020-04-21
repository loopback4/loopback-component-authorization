import { inject, Provider } from "@loopback/core";

import { AuthorizationBindings } from "../keys";

import { PermissionsList, GetUserPermissionsFn, StringKey } from "../types";

import { DefaultUserRepository, DefaultRoleRepository } from "../repositories";

export class GetUserPermissionsProvider<Permissions extends PermissionsList>
    implements Provider<GetUserPermissionsFn<Permissions>> {
    constructor(
        @inject(AuthorizationBindings.USER_REPOSITORY)
        private userRepository: DefaultUserRepository,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        private roleRepository: DefaultRoleRepository
    ) {}

    async value(): Promise<GetUserPermissionsFn<Permissions>> {
        return async id => this.getUserPermissions(id);
    }

    private async getUserPermissions(id: string) {
        const userRoleIDs = await this.getUserRoles(id);

        const roleIDs = await this.getParentRoles(userRoleIDs);

        return await this.getRolesPermissions(roleIDs);
    }

    private async getUserRoles(userID: string) {
        const user = await this.userRepository.findById(userID, {
            include: [{ relation: "userRoles" }]
        });

        return (user.userRoles || []).map(userRole => userRole.roleId);
    }

    private async getParentRoles(rolesIDs: string[]) {
        let result: string[] = [];

        /**
         * 1. Get role IDs
         * 2. Find parents IDs
         * 3. Filter parents IDs
         * 4. Remove duplicated parents IDs (recursive circular bugfix)
         * 4. Until we have parents
         *      5. Push parents IDs
         *      6. Get parents
         */
        let parentsIDs = rolesIDs;
        while (parentsIDs.length > 0) {
            result.push(...parentsIDs);

            const roles = await this.roleRepository.find({
                where: { id: { inq: parentsIDs } }
            });

            parentsIDs = roles
                .map(role => role.parentId)
                .filter(parentId => Boolean(parentId))
                .filter(parentId => result.indexOf(parentId) < 0);
        }

        return result;
    }

    private async getRolesPermissions(rolesIDs: string[]) {
        const roles = await this.roleRepository.find({
            where: { id: { inq: rolesIDs } },
            include: [
                {
                    relation: "rolePermissions",
                    scope: { include: [{ relation: "permission" }] }
                }
            ]
        });

        const permissions = roles
            .map(role =>
                (role.rolePermissions || [])
                    .map(
                        rolePermission =>
                            rolePermission.permission &&
                            rolePermission.permission.key
                    )
                    .filter(rolePermission => Boolean(rolePermission))
            )
            .reduce((prev, permissionKeys) => prev.concat(permissionKeys), []);

        return [...new Set(permissions)] as StringKey<Permissions>[];
    }
}
