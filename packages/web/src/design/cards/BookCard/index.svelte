<script lang="typescript">
  // Importing theme wrapper
  import theme from 'src/design/Wrapper'

  // Importing components
  import {
    Viewer
  } from 'src/design';

  import Icon from 'src/components/Icon.svelte';

  // Importing types
  import type { IBook, IProfile, IBookChapter, IBookRating, IUniversalText } from '@app/shared';

  // Importing properties-related data
  // -types
  import types from './properties/Types';
  import type { EBookCardType } from './properties/Types';

  // -sizes
  import sizes from './properties/Sizes';
  import type { EBookCardSize } from './properties/Sizes';

  // Exporting variables
  export let type: EBookCardType = 'default';
  export let size: EBookCardSize = 'base';
  export let book: IBook | undefined;

  // Destructuring variables
  $: creator = book.creator as IProfile;
  $: chapters = book.chapters as Array<IBookChapter>;
  $: ratings = book.ratings as Array<IBookRating>;
  $: description = book.description as IUniversalText;

  $: currentType = types[type];
</script>

<div class="{ theme.$(`cards.book.size.${size}`, sizes[size]) } relative" style="padding-bottom: 50%;">
  <div class="absolute w-full h-full p-2">
    <div style="z-index: 2;" class="{ theme.$(`cards.book.${type}`, types[type].classes) }">

      <!-- Author -->
      { #if !currentType.hide.includes('author') }
        <div class="w-full flex items-center justify-between">
          <!-- Author and fandom -->
          <div class="py-1.5 px-3">
            <!-- Author -->
            <div class="flex items-center">
              <div class="bg-red-500 rounded-full w-7 h-7"></div>

              <div class="ml-2">
                <h2 class="text-sm text-white font-medium">{ creator.username }</h2>
                <p class="text-xs text-white opacity-70">Автор</p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div>
            <Icon name="more-horizontal" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "3" }} />
          </div>
        </div>
      { /if }

      <!-- Title -->
      <div class="mb-2">
        <div class="flex items-center mt-0.5 opacity-70 text-white">
          { #if !currentType.hide.includes('author') }
            <Icon name="link-2" attrs={{ class: "w-4 h-4" }} />

            <p class="ml-1.5 text-xs">Ориджинал</p>
          { :else }
            <Icon name="user" attrs={{ class: "w-4 h-4" }} />  

            <p class="ml-1.5 text-xs">{ creator.username }</p>
          { /if }
        </div>

        <h1 class="text-3xl text-white font-medium">{ book.title }</h1>
      
        { #if !currentType.hide.includes('tags') }
          <!-- Tags -->
          <div class="w-full flex flex-wrap mt-2">
            <div class="m-0.5 px-2 py-1 rounded-full bg-pink-500 flex items-center justify-center">
              <!-- Icon -->
              <p class="text-white font-medium text-sm">⚣</p>
            
              <p class="ml-1 text-xs text-white font-medium">Гей</p>
            </div>

            <div class="m-0.5 px-2 py-1 rounded-full bg-purple-600 flex items-center justify-center">
              <p class="text-xs text-white font-medium">Драма</p>
            </div>

            <div class="m-0.5 px-2 py-1 rounded-full bg-gray-500 flex items-center justify-center">
              <p class="text-xs text-white font-medium">До 5000 слов</p>
            </div>
          </div>
        { /if }
      </div>

      <!-- Description -->
      <div class="text-sm flex-grow overflow-hidden relative">
        <div class="absolute w-full h-full overflow-auto">
          <Viewer input="{ description.nodes }" />
        </div>
      </div>

      { #if !currentType.hide.includes('buttons') }
        <!-- Buttons -->
        <div class="mt-8 w-full flex items-center">
          <div class="mr-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center">
            <p class="text-white font-medium">Читать</p>
          </div>

          <div class="ml-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center">
            <p class="text-white font-medium">На потом</p>
          </div>
        </div>
      { /if }
    </div>
  </div>
</div>