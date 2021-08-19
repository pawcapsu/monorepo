import { createUnionType } from "@nestjs/graphql";
import * as nodes from 'src/types/models/content/Text/Nodes';

export const NodeEntityUnion = createUnionType({
  name: 'UNodeEntity',
  types: () => Object.values(nodes),
})