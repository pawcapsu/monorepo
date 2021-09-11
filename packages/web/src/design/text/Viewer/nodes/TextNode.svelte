<script lang="ts">
  // Importing types
  import type { ITextNode } from '@app/shared';
 
  // Exporting variables
  export let node: ITextNode;
</script>

<p>{ node.content }</p>