import {
    MetadataInspector,
    Constructor,
    MethodDecoratorFactory
} from "@loopback/context";

import { AUTHORIZATION_METADATA_KEY } from "../keys";

import { PermissionsList, Condition } from "../types";

/**
 * Authorization metadata stored via Reflection API
 */
export type AuthorizationMetadata<
    Permissions extends PermissionsList
> = Condition<Permissions>;

export function authorize<Permissions extends PermissionsList>(
    metadata?: AuthorizationMetadata<Permissions>
) {
    return MethodDecoratorFactory.createDecorator<
        AuthorizationMetadata<Permissions>
    >(AUTHORIZATION_METADATA_KEY, metadata || { and: [] });
}

export function getAuthorizeMetadata<Permissions extends PermissionsList>(
    controllerClass: Constructor<{}>,
    methodName: string
): AuthorizationMetadata<Permissions> {
    return (
        MetadataInspector.getMethodMetadata<AuthorizationMetadata<Permissions>>(
            AUTHORIZATION_METADATA_KEY,
            controllerClass.prototype,
            methodName
        ) || { and: [] }
    );
}
