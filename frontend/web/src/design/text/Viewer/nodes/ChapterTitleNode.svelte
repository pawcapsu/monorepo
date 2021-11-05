<script lang="ts">
  // Importing types
  import type { IChapterTitleNode } from '@app/shared';
  
  // Importing components
  import Icon from 'src/components/Icon.svelte';
  import Viewer from 'src/design/text/Viewer/index.svelte';

  // Exporting variables
  export let node: IChapterTitleNode;
</script>

<div class="mt-10 mb-6">
  <!-- Title -->
  <h1 class="mx-1 text-2xl text-white font-medium">{ node?.chapter?.title }</h1>

  <!-- Stats -->
  <div class="mt-1 flex items-center justify-start">
    <!-- Likes -->
    <div class="mx-1 px-2 py-1 rounded-full bg-gray-900 opacity-80 flex items-center justify-center">
      <Icon name="heart" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "3" }} />
      
      <p class="text-xs text-white font-medium ml-1">200</p>
    </div>

    <!-- Comments -->
    <div class="mx-1 px-2 py-1 rounded-full bg-gray-900 opacity-80 flex items-center justify-center">
      <Icon name="message-circle" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "3" }} />
      
      <p class="text-xs text-white font-medium ml-1">10</p>
    </div>
  </div>

  <!-- Chapter Description
  <Viewer input={ node?.chapter?.description?.nodes ?? [] } /> -->
</div>