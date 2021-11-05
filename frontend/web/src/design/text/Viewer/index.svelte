<script lang="ts">
  // Importing types
  import type { UNodeEntity } from '@app/shared';
  import { ENodeType } from '@app/shared';

  // Importing NodeTypes
  import TextNode from './nodes/TextNode.svelte';
  import PictureNode from './nodes/PictureNode.svelte';
  import DividerNode from './nodes/DividerNode.svelte';
  import BookReviewNode from './nodes/BookReviewNode.svelte';
  import ChapterTitleNode from './nodes/ChapterTitleNode.svelte';

  const nodes = {
    [ENodeType.TEXT]: TextNode,
    [ENodeType.PICTURE]: PictureNode,
    [ENodeType.BOOK_REVIEW]: BookReviewNode,
    [ENodeType.CHAPTER_TITLE]: ChapterTitleNode,
  };

  export let input: UNodeEntity[];
</script>

<div>
  { #each input as node }
    <svelte:component this={ nodes[node.type] } node={node} />

    <!-- Divider -->
    <DividerNode />
  { /each }
</div>