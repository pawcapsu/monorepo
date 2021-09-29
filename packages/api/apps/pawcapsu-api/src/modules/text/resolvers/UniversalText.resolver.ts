import { Resolver, ResolveField, Parent, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { Profile, UniversalText } from "@pawcapsu/types/models";
import { NodeEntityUnion } from "@pawcapsu/types/unions";
import { ObjectId } from '@pawcapsu/types';
import { UniversalTextService } from "../services";
import { TextNodeInput } from "@pawcapsu/types/dto/content/Text/Nodes";
import { AddNodeOptions } from "@pawcapsu/types/dto";
import { GqlAuthGuard } from "@pawcapsu/auth";
import { UseGuards } from "@nestjs/common";

@Resolver(of => UniversalText)
export class UniversalTextResolver {
  constructor(
    private readonly textService: UniversalTextService,
  ) {}

  // mutation addTextNode
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => UniversalText)
  async addTextNode(
    @Args('id', { type: () => String }) id: ObjectId,
    @Args('node') node: TextNodeInput,

    @Args('options', { nullable: true, description: 'Different options' }) options: AddNodeOptions,
    @Context('user') user: Profile,
  ) {
    return await this.textService.addNode(user, id, node);
  };
  
  // mutation modifyTextNode
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => UniversalText)
  async modifyTextNode(
    @Args('id', { type: () => String }) id: ObjectId,
    @Args('nodeId', { type: () => Number }) nodeId: number,
    @Args('updatedNode') updatedNode: TextNodeInput,

    @Context('user') user: Profile,
  ) {
    return await this.textService.modifyNode(user, id, nodeId, updatedNode);
  };

  // mutation addPictureNode (+todo)

  // mutation modifyPictureNode (+todo)

  // mutation deleteNode
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => UniversalText)
  async deleteNode(
    @Args('id', { type: () => String }) id: ObjectId,
    @Args('nodeId') nodeId: number,
    
    @Context('user') user: Profile,
  ) {
    return this.textService.deleteNode(user, id, nodeId);
  };

  // mutation moveNode
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => UniversalText)
  async moveNode(
    @Args('id', { type: () => String }) id: ObjectId,
    @Args('fromNode') fromNodeId: number,
    @Args('toNode') toNodeId: number,

    @Context('user') user: Profile,
  ) {
    return await this.textService.moveNode(user, id, fromNodeId, toNodeId);
  };

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