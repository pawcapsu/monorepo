import { createUnionType } from "@nestjs/graphql";
import { ENodeType } from "@app/shared";
import * as nodes from 'src/types/models/content/Text/Nodes';

export const NodeEntityUnion = createUnionType({
  name: 'UNodeEntity',
  types: () => Object.values(nodes),
  resolveType(value) {
    switch (value.type) {
      case ENodeType.PICTURE:
        return nodes.PictureNodeObject;

      case ENodeType.TEXT:
        return nodes.TextNodeObject;
    }
  },
})