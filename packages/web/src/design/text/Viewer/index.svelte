<script lang="ts">
  // Importing types
  import type { UNodeEntity } from '@app/shared';
  import { ENodeType } from '@app/shared';

  // Importing NodeTypes
  import TextNode from './nodes/TextNode.svelte';
  import PictureNode from './nodes/PictureNode.svelte';
  import DividerNode from './nodes/DividerNode.svelte';

  export let input: UNodeEntity[];
</script>

<div>
  { #each input as node }
    { #if node.type === ENodeType.TEXT }
      <TextNode node="{node}" />
    { :else if node.type === ENodeType.PICTURE }
      <PictureNode node="{node}" />
    { /if }

    <!-- Divider -->
    <DividerNode />
  { /each }
</div>