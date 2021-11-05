<script lang="ts">
  // Importing types
  import type { IBookReviewNode } from '@app/shared';
  import { ENodeType } from '@app/shared';

  // Importing components
  import Viewer from 'src/design/text/Viewer/index.svelte';
  import Icon from 'src/components/Icon.svelte';

  // Exporting variables
  export let node: IBookReviewNode;
</script>

<div class="w-full rounded-xl bg-gray-900 p-6 relative mb-16">
  <!-- Header (Book title & Book Creator) -->
  <div class="w-full flex justify-between items-center px-2">
    <!-- Title -->
    <div class="">
      <h1 class="text-2xl text-white font-medium">{ node?.book?.title }</h1>
      
      <!-- Book type -->
      <div class="flex items-center mt-0.5 opacity-70 text-white">
        <Icon name="link-2" attrs={{ class: "w-4 h-4" }} />
        <p class="ml-1.5 text-xs">Ориджинал</p>
      </div>
    </div>

    <!-- Creator -->
    <div class="flex items-center opacity-80">
      <div class="bg-red-500 rounded-full w-7 h-7"></div>

      <div class="ml-2">
        <h2 class="text-sm text-white font-medium">SniperFox213</h2>
        <p class="text-xs text-white opacity-70">Автор</p>
      </div>
    </div>
  </div>

  <!-- Description (and tags) -->
  <div class='my-2'>
    <!-- Tags -->
    <div class="w-full flex flex-wrap">
      <div class="m-1 px-2 py-1.5 rounded-full bg-indigo-500 flex items-center justify-center">
        <p class="text-xs text-white font-medium">Романтика</p>
      </div>

      <div class="m-1 px-2 py-1.5 rounded-full bg-blue-500 flex items-center justify-center">
        <p class="text-xs text-white font-medium">Экшн</p>
      </div>

      <div class="m-1 px-2 py-1.5 rounded-full bg-yellow-500 flex items-center justify-center">
        <p class="text-xs text-white font-medium">Гей</p>
      </div>
    </div>

    <div class="my-3">
      <Viewer input={ node?.book?.description?.nodes.filter((x) => x.type != ENodeType.PICTURE) } />
    </div>
  </div>

  <!-- Stats -->
  <div class="w-full flex flex-wrap">
    <!-- Views -->
    <div class="mx-1 px-3 py-1 rounded-full bg-gray-800 opacity-80 flex items-center justify-center">
      <Icon name="eye" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "3" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">1.5k</p>
    </div>

    <!-- Likes -->
    <div class="mx-1 px-3 py-1 rounded-full bg-gray-800 opacity-80 flex items-center justify-center">
      <Icon name="heart" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "3" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">200</p>
    </div>

    <!-- Comments -->
    <div class="mx-1 px-3 py-1 rounded-full bg-gray-800 opacity-80 flex items-center justify-center">
      <Icon name="message-circle" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "3" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">10</p>
    </div>
  </div>
</div>