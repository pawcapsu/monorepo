<script lang="ts">
  // Importing types
  import type { IPictureNode } from '@app/shared';

  // Exporting variables
  export let node: IPictureNode;
</script>

<div class="w-full relative" style="padding-bottom: 50%;">
  <img class="absolute w-full h-full rounded-xl" style="object-fit: cover;" src="{ node.url }" alt="{ node.caption }">
</div>