<script lang="ts">
  // Importing types
  import type { ITextNode } from '@app/shared';
 
  // Importing components
  import Paragraph from 'src/design/typography/Paragraph/index.svelte';

  // Exporting variables
  export let node: ITextNode;
</script>

<Paragraph>{ node.content }</Paragraph>