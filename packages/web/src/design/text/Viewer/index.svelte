<script lang="ts">
  // Importing types
  import type { UNodeEntity } from '@app/shared';
  import { ENodeType } from '@app/shared';

  export let input: UNodeEntity[];
</script>

<div>
  { #each input as node }
    { #if node.type === ENodeType.TEXT }
      <p>{ node.content }</p>
    { /if }
  { /each }
</div>