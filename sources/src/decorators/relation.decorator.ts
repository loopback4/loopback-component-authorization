import { Entity, EntityResolver } from "@loopback/repository";

export function relation<Model extends Entity, RelationModel extends Entity>(
    key: keyof Model,
    resolver: EntityResolver<RelationModel>
) {
    return function(model: Function & { definition?: any }) {
        model.definition.relations[key].source = model;
        model.definition.relations[key].target = resolver;
    };
}
