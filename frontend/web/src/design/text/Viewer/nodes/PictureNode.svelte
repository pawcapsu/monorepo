<script lang="ts">
  // Importing types
  import type { IPictureNode } from '@app/shared';

  import Icon from 'src/components/Icon.svelte';

  // Exporting variables
  export let node: IPictureNode;
</script>

<div class="my-6 w-full flex justify-center items-center">
  <div class="w-2/3 relative" style="padding-bottom: 50%;">
    <img class="absolute w-full h-full rounded-xl" style="object-fit: cover;" src="{ node.url }" alt="{ node.caption }">
  
    <!-- Image manipulation -->
    <div class="absolute right-0 top-0 p-2">
      <div class="rounded-full bg-gray-800 flex items-center px-4 py-1.5">
        <p class="text-white text-sm opacity-80">{ node.caption }</p>
        
        <Icon name="external-link" attrs={{ class: "w-4 h-4 text-white ml-2", "stroke-width": "2" }} />
      </div>
    </div>
  </div>
</div>