import { Resolver, ResolveField, Parent, Query, Mutation, Args } from "@nestjs/graphql";
import { UniversalText } from "src/types/models";
import { NodeEntityUnion } from "src/types/unions";
import { ObjectId } from 'src/types';
import { UniversalTextService } from "../services";
import { TextNodeInput } from "src/types/dto/content/Text/Nodes";

@Resolver(of => UniversalText)
export class UniversalTextResolver {
  constructor(
    private readonly textService: UniversalTextService,
  ) {}

  // mutation addTextNode
  @Mutation(returns => UniversalText)
  async addTextNode(
    @Args('id', { type: () => String }) id: ObjectId,
    @Args('node') node: TextNodeInput,
  ) {
    return await this.textService.addNode(id, node);
  };

  // mutation addPictureNode (+todo)

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