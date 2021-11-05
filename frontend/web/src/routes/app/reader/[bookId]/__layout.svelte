<script lang="typescript">
  // Importing modules  
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  import Icon from 'src/components/Icon.svelte';

  import { page } from '$app/stores';
  import { SidebarState } from '$stores/sidebar';
  import { CurrentBook, ReaderSettings } from '$stores/reader';

  // Subscribing to page store to change
  const unsubscribe = page.subscribe((currentPage) => {
    if (currentPage.path.includes('reader')) {
      SidebarState.setState('in-reader');
    } else {
      SidebarState.setState('normal');
      
      // Clearing CurrentBook store
      CurrentBook.clear();

      unsubscribe();
    };
  });

  let viewportSize = 'w-full px-16';

  // Subscribing to ReaderSetting store to update viewportSize setting
  ReaderSettings.subscribe((store) => {
    if (store.viewportSize == '1/3') {
      // 1/3 size 
      viewportSize = 'w-1/3';
    } else if (store.viewportSize == '1/2') {
      // 1/2 size
      viewportSize = 'w-1/2';
    } else {
      // Full size
      viewportSize = 'w-full px-16';
    };
  });

  onMount(() => {
    CurrentBook.fetchInfo($page.params.bookId);
    
    setTimeout(() => {
      loaded = true;
    }, 250);
  });

  let loaded = false;
</script>

<!-- Transition -->
{ #if !loaded }
  <div out:fade class="absolute z-50 w-full h-screen bg-gray-800"></div>
{ /if }

<!-- Content -->
<main class="w-full flex justify-center h-screen overflow-y-auto bg-gray-800">
  <!-- Header -->
  <header class="z-10 opacity-80 shadow-xl w-full absolute inset-x-0 top-0 bg-gray-900 py-2 flex justify-center items-center">
    <!-- Settings -->
    <div class="mx-1 px-3 py-1 rounded-full bg-gray-700 opacity-80 flex items-center justify-center">
      <Icon name="tool" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "2" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">Настройки</p>
    </div>
  </header>

  <!-- Content -->
  <div class="{ viewportSize } pt-20">
    <slot />
  </div>
</main>