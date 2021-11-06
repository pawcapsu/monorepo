<script lang="typescript">
  // Importing modules  
  import { onMount } from "svelte";
  import { fade, scale } from 'svelte/transition';

  import Icon from 'src/components/Icon.svelte';
  import { Viewer } from 'src/design';

  import { page } from '$app/stores';
  import { SidebarState } from '$stores/sidebar';
  import { CurrentBook, ReaderSettings } from '$stores/reader';

  import type { EUniversalTextType, IUniversalText } from '@app/shared';
  import { ENodeType } from '@app/shared';
  import { goto } from "$app/navigation";

  // Variables
  let loaded = false;
  let actionWindow = false;

  const text: IUniversalText = { 
    version: -1,
    type: 'TEXT' as EUniversalTextType,
    nodes: [],
  };

  // Subscribing to page store to change
  const unsubscribe = page.subscribe((currentPage) => {
    // Checking if we are in a reader state
    if (currentPage.path.includes('reader')) {
      SidebarState.setState('in-reader');
    } else {
      SidebarState.setState('normal');
      
      // Clearing CurrentBook store
      CurrentBook.clear();

      unsubscribe();
    };

    // Checking if we need to show ActionWindow
    let pathSplitted = currentPage.path.split('/');
    if (pathSplitted[pathSplitted.length - 1] != currentPage.params.bookId) {
      actionWindow = true;
    } else {
      actionWindow = false;
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

  // Subscribing to CurrentBook store
  CurrentBook.subscribe((book) => {
    if (!book.book) return;

    if (!text.nodes[0] || text.nodes[0] && text.nodes[0].type != ENodeType.BOOK_REVIEW) {
      // Adding BookReview section
      text.nodes = [
        {
          type: ENodeType.BOOK_REVIEW,
          book: book.book,
        },
      ];
    };

    if (book.chapters) {
      // Adding other nodes to list
      const content = book.chapters[0].content as IUniversalText;
      text.nodes = [...text.nodes, { type: ENodeType.CHAPTER_TITLE, chapter: book.chapters[0] }, ...content.nodes];
    };
  });

  // Function to close actionWindow
  function closeActionWindow() {
    const pathSplitted = $page.path.split('/').slice(1, 4);
    goto(`/${pathSplitted.join('/')}`);
  };

  function openActionWindow(action: string) {
    goto(`${$page.path}/${action}`);
  };

  // onMount event
  onMount(() => {
    text.nodes = [];
    CurrentBook.fetchInfo($page.params.bookId);
    
    setTimeout(() => {
      loaded = true;
    }, 250);
  });
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
    <div on:click={() => {
      openActionWindow('settings');
    }} class="cursor-pointer mx-1 px-3 py-1 rounded-full bg-gray-700 opacity-80 flex items-center justify-center">
      <Icon name="tool" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "2" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">Настройки</p>
    </div>
  </header>

  <!-- Action window -->
  { #if actionWindow }
    <div class="z-50 absolute inset-0 bg-black bg-opacity-20 w-full h-screen flex items-center justify-center md:px-16 md:py-12">
      <!-- Close-window area -->
      <div on:click={() => {
        closeActionWindow()
      }} class="absolute z-10 w-full h-screen"></div>

      <!-- Content area -->
      <div in:scale out:fade class="z-20 w-full h-full md:rounded-xl bg-gray-900 shadow-xl p-4 relative">
        <!-- Close window button -->
        <div class="hidden md:block z-50 absolute right-0 top-0 p-4">
          <div on:click={() => {
            closeActionWindow();
          }} class="cursor-pointer">
            <Icon name="x" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "2.5" }} />
          </div>
        </div>

        <slot />
      </div>
    </div>
  { /if }

  <!-- Content -->
  <div class="{ viewportSize } pt-20 h-screen bg-gray-800">
    <!-- UniversalTextViewer -->
    <Viewer input={text.nodes} />
  </div>
</main>