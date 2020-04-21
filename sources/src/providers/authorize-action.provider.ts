import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";
import { HttpErrors } from "@loopback/rest";
import { InvocationContext } from "@loopback/context";

import {
    PermissionsList,
    Condition,
    FullKey,
    StringKey,
    AuthorizeFn
} from "../types";

import { getAuthorizeMetadata } from "../decorators";

export class AuthorizeActionProvider<Permissions extends PermissionsList>
    implements Provider<AuthorizeFn<Permissions>> {
    constructor(
        @inject.getter(CoreBindings.CONTROLLER_CLASS)
        private readonly getController: Getter<Constructor<{}>>,
        @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
        private getMethodName: Getter<string>
    ) {}

    async value(): Promise<AuthorizeFn<Permissions>> {
        return async (permissions, methodArgs) => {
            let controller: any;
            let methodName: string = "";
            let metadata: Condition<Permissions> = async () => true;

            try {
                controller = await this.getController();
                methodName = await this.getMethodName();
                metadata = getAuthorizeMetadata(
                    controller,
                    methodName
                ) as Condition<Permissions>;
            } catch (error) {}

            let access = await authorizeFn<Permissions>(
                metadata,
                permissions,
                new InvocationContext(
                    controller,
                    controller,
                    methodName,
                    methodArgs
                )
            );

            if (!access) {
                throw new HttpErrors.Forbidden(
                    "You don't have permission to access this endpoint!"
                );
            }
        };
    }
}

export async function authorizeFn<Permissions>(
    condition: Condition<Permissions>,
    permissions: StringKey<Permissions>[],
    invocationContext: InvocationContext
) {
    const authorizeAnd = async (conditions: Condition<Permissions>[]) => {
        // bugfix: for empty arrays return true
        if (conditions.length <= 0) {
            return true;
        }

        for (let condition of conditions) {
            let result = await authorizeFn(
                condition,
                permissions,
                invocationContext
            );

            // lazy evaluation for high performance
            if (!result) {
                return false;
            }
        }

        return true;
    };

    const authorizeOr = async (conditions: Condition<Permissions>[]) => {
        // bugfix: for empty arrays return true
        if (conditions.length <= 0) {
            return true;
        }

        for (let condition of conditions) {
            let result = await authorizeFn(
                condition,
                permissions,
                invocationContext
            );

            // lazy evaluation for high performance
            if (result) {
                return true;
            }
        }

        return false;
    };

    const authorizePermission = async (key: FullKey<Permissions>) => {
        let result = false;

        if (typeof key.key === "string") {
            // string key
            result = permissions.indexOf(key.key) >= 0;
        } else if (typeof key.key === "function") {
            // async key
            result = await key.key(invocationContext);
        }

        return key.not ? !result : result;
    };

    if (condition) {
        if (typeof condition === "object") {
            if ("and" in condition) {
                return await authorizeAnd(condition.and);
            } else if ("or" in condition) {
                return await authorizeOr(condition.or);
            } else {
                return await authorizePermission(condition);
            }
        } else {
            return await authorizePermission({ key: condition });
        }
    }

    return false;
}
