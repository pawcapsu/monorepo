import { Resolver, ResolveField, Parent, Query } from "@nestjs/graphql";
import { UniversalText } from "src/types/models";
import { NodeEntityUnion } from "src/types/unions";

import { TextNodeObject } from 'src/types/models';
import { ENodeType } from '@app/shared';

@Resolver(of => UniversalText)
export class UniversalTextResolver {
  constructor() {}

  @Query(returns => UniversalText)
  async getText() {

  };

  // resolve content
  @ResolveField('nodes', returns => [NodeEntityUnion])
  async resolveNodes(
    @Parent() text: UniversalText
  ) {
    return text.nodes;
  };
};