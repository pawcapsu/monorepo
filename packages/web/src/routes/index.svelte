<script lang="ts">
  // Importing modules
  import { UserStore } from '$stores/user';
  import { PaginatedBooksService as Books } from '@pawcapsu/services/book';
  import { onMount } from 'svelte';

  // Importing types
  import type { IBook } from '@app/shared';

	// Importing components
  import { 
    Button,
    Logotype,
    Container,
    Heading,
    Paragraph,
    BookCard,
  } from '@pawcapsu/design';
  
  import Icon from '@pawcapsu/components/Icon.svelte';
  import { goto } from "$app/navigation";

  let books: IBook[];
  onMount(async () => {
    books = (await Books.get({ limit: 3 })) as IBook[];
  });
</script>

<!-- Main landing area -->
<Container type='full' flex='centered'>
  <Container size='half' classes='px-6'>
    <Logotype type='full' />

    <!-- Texts -->
    <Container classes="my-6">
      <Heading size="extra-xl">Новый, <span class="bg-indigo-500 px-1">Социальный</span> фикрайтинг</Heading>
    
      <Paragraph size="md">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo, delectus debitis ut excepturi repellat fuga sequi enim vero corporis dolores blanditiis pariatur reiciendis modi rerum! Аниме на аве мать в канаве</Paragraph>
    </Container>

    <!-- Buttons -->
    <Container flex='centered'>
      { #if $UserStore.user }
        <Button on:click={() => {
          goto('/app');
        }} size="full">
          Перейти к приложению
        </Button>
      { :else }
        <Button on:click={() => {
          goto('/login/link');
        }} size="full">
          <p class="text-white">Авторизоваться</p>

          <Icon name="user" attrs={{ class: "w-4 h-4 text-white ml-2" }} />          
        </Button>
      { /if }

      <Button type='ghost' size="full">
        Узнать больше
      </Button>
    </Container>
  </Container>

  <!-- Popular books library -->
  <Container type="full" size="half" background="light-dark" flex="centered">
    <!-- Books -->
    <div class="w-full flex flex-wrap flex-grow px-12 py-12">
      { #if books }
        { #each books as entry }
          <BookCard book="{ entry }" type="compact" size="medium" />
        { /each }
      { /if }
      
      <div class="w-1/2 relative" style="padding-bottom: 50%;">
        <div class="absolute w-full h-full p-2">
          <div style="z-index: 2;" class="w-full h-full rounded-xl border-4 border-dotted border-gray-900 bg-gray-900 bg-opacity-40 flex flex-col items-center justify-center p-4">
            <div class="text-center">
              <h1 class="text-xl text-white font-medium">Заинтересовали?</h1>

              <p class="mt-4 text-sm text-white opacity-75">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, nobis!</p>
            </div>

            <!-- Button -->
            <div class="mt-4">
              <button class="px-4 py-2 rounded-md bg-indigo-500 flex items-center justify-center">
                <p class="text-white mr-2">Библиотека</p>

                <Icon name="chevron-right" attrs={{ class: "w-5 h-5 text-white" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</Container>