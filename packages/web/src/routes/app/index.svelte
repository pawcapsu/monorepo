<script lang="typescript">
  // Importing modules
  import Icon from '../../components/Icon.svelte';
  import { onMount } from 'svelte';
  import { ExploreVariantsService as ExploreVariants } from '$services/explore';
  import { PaginatedBooksService as Books } from '$services/book';

  // Importing types
  import type { IExploreBadge, IPaginatedBooks } from '@app/shared';

  // Importing components
  import {
    Container,
    Heading,
    Paragraph,
    Footer,
    BookCard,
  } from 'src/design';

  let exploreBadges: IExploreBadge[];
  let books: IPaginatedBooks;
  onMount(async () => {
    // Getting exploreBadges
    exploreBadges = (await ExploreVariants.get({ limit: 5 })) as IExploreBadge[];
  
    // Getting books
    books = (await Books.paginate({ limit: 25 })) as IPaginatedBooks;
  });
</script>

<Container flex="flex">
  <!-- Sidebar -->
  <Container classes="px-3 py-2 h-screen flex flex-col items-center justify-between">
    <div class="flex flex-col items-center">
      <!-- Account Icon -->
      <div class="my-1.5 w-10 h-10 rounded-full flex items-center justify-center" style="background: url('https://cdn.discordapp.com/banners/155749532615966720/cac172ea1db4be9f83dfc7232062e944.png?size=512'); background-position: center; background-size: cover;"></div>
      
      <!-- Services page -->
      <div class="my-1.5 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
        <Icon name="grid" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "2.5" }} />
      </div>

      <!-- Explore Page -->
      <div class="my-1.5 w-10 h-10 ring-2 ring-blue-400 border-2 border-blue-500 rounded-full bg-gray-500 flex items-center justify-center relative">
        <Icon name="compass" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "3" }} />

        <div class="absolute top-0 right-0" style="margin-top: -5px; margin-right: -5px;">
          <div class="w-4 h-4 bg-red-400 rounded-full"></div>
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 3px;" class="my-1.5 opacity-30 w-10 bg-gray-600 rounded-full"></div>
    
      <div style="background: url('https://cdn.discordapp.com/icons/794490811639267339/f63b8efdecb1930a6ecfb98512547362.png?size=128'); background-size: cover; background-position: center;" class="rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative">
      </div>
    </div>

    <!-- Settings -->
    <div class="flex flex-col items-center">
      <div class="my-1.5 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
        <Icon name="settings" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "2.5" }} />
      </div>
    </div>
  </Container>

  <!-- Places -->
  <div class="w-1/4 h-screen overflow-y-auto bg-gray-800 bg-opacity-95 flex flex-col">    
    <!-- Page title -->
    <div class="w-full px-3 pt-4">
      <h1 class="text-2xl text-white font-bold">Исследовать</h1>
      <p class="text-sm text-white opacity-70">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque.</p>
    </div>
    
    <!-- Search -->
    <div class="pt-4 px-3 w-full relative">
      <div class="w-full rounded-lg bg-gray-900 bg-opacity-80 flex items-center px-3 py-2">
        <Icon name="search" attrs={{ class: "mr-2 w-4 h-4 text-white opacity-60", "stroke-width": "3" }} />

        <p class="w-auto text-sm text-white opacity-60">Поиск...</p>
      </div>
    </div>

    <!-- Type -->
    <div class="px-2 py-4">
      <!-- Title -->
      <div class="px-2 mb-2">
        <div class="flex items-center">
          <h1 class="text-lg text-white font-bold">Тип рассказа</h1>
        
          <p class="mt-1 text-xs text-white opacity-50 ml-1.5">1 из 3</p>
        </div>
      </div>

      <!-- Types -->
      <div class="flex flex-wrap">
        <div class="m-1 px-3 py-1.5 rounded-full bg-blue-500 flex items-center justify-center">
          <!-- Icon -->
          <img class="w-4 h-4 mr-2" src="./icons/writing-hand.png" alt="">
          
          <p class="text-sm text-white font-medium">Ориджинал</p>

          <!-- Close icon -->
          <Icon name="x" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "4" }} />
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center">
          <img class="w-4 h-4 mr-2" src="./icons/books.png" alt="">
          
          <p class="text-sm text-white font-medium">Фанфик</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center">
          <img class="w-4 h-4 mr-2" src="./icons/newspaper.png" alt="">
          
          <p class="text-sm text-white font-medium">Статья</p>
        </div>
      </div>
    </div>

    <div class="mb-2 px-4 w-full relative">
      <div style="height: 3px;" class="w-full bg-gray-500 opacity-20 rounded-full"></div>
    </div>

    <!-- Categories -->
    <div class="px-2 py-4">
      <!-- Title -->
      <div class="px-2 mb-2">
        <div class="flex items-center">
          <h1 class="text-lg text-white font-bold">Категории</h1>
          <p class="mt-1 text-xs text-white opacity-50 ml-1.5">3 из 69</p>
        </div>
      </div>

      <div class="flex flex-wrap">
        <div class="m-1 px-3 py-1.5 rounded-full bg-red-500 flex items-center justify-center">
          <!-- <Icon name="alert-triangle" attrs={{ class: "mr-2 w-4 h-4 text-white", "stroke-width": "2.5" }} /> -->
          
          <p class="text-sm text-white font-medium">PWP</p>
        
          <Icon name="x" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "4" }} />
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center">
          <p class="text-sm text-white font-medium">Романтика</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center">
          <p class="text-sm text-white font-medium">Экшн</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-yellow-500 flex items-center justify-center">
          <p class="text-sm text-white font-medium">Гей</p>

          <Icon name="x" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "4" }} />
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center">
          <p class="text-sm text-white font-medium">Драма</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full bg-indigo-400 flex items-center justify-center">
          <p class="text-sm text-white font-medium">Шкшкшкш</p>
        
          <Icon name="x" attrs={{ class: "w-3 h-3 text-white ml-1", "stroke-width": "4" }} />
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center">
          <p class="text-sm text-white font-medium">Чики</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center">
          <p class="text-sm text-white font-medium">Пуки</p>
        </div>

        <div class="m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center">
          <p class="text-sm text-white font-medium">Кскскс</p>
        </div>

        <!-- More -->
        <div class="m-1 px-3 py-1.5 rounded-full flex bg-gray-900 bg-opacity-70 items-center justify-center">
          <Icon name="more-horizontal" attrs={{ class: "mr-2 w-4 h-4 text-white", "stroke-width": "2.5" }} />
          
          <p class="text-sm text-white font-medium">Больше</p>
        </div>
      </div>
    </div>

    <div class="mb-2 px-4 w-full relative">
      <div style="height: 3px;" class="w-full bg-gray-500 opacity-20 rounded-full"></div>
    </div>

    <!-- Filter mode -->
    <div class="px-2 py-4">
      <!-- Title -->
      <div class="px-2 mb-2">
        <div>
          <h1 class="text-lg text-white font-bold">Фильтрация</h1>
          <p class="text-xs text-white opacity-70">Улучшенные инструменты фильтрации</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-2 pt-1">

        <!-- Date -->
        <div class="my-2 py-1.5 flex items-center justify-between">
          <div class="flex items-center">
            <!-- Icon -->
            <Icon name="calendar" attrs={{ class: "w-5 h-5 text-white opacity-60 mr-2" }} />

            <!-- Text -->
            <h2 class="text-sm text-white font-medium">Дата обновления</h2>
          </div>

          <div>
            <Icon name="chevron-right" attrs={{ class: "w-5 h-5 text-white opacity-60" }} />
          </div>
        </div>
        
        <!-- Tags -->
        <div class="my-2 py-1.5 flex items-center justify-between">
          <div class="flex items-center">
            <!-- Icon -->
            <Icon name="list" attrs={{ class: "w-5 h-5 text-white opacity-60 mr-2" }} />

            <!-- Text -->
            <div>
              <h2 class="text-sm text-white font-medium">Тэги</h2>
              <p class="text-xs text-white opacity-70">Выбранно 5 тэгов</p>
            </div>
          </div>

          <div>
            <Icon name="chevron-right" attrs={{ class: "w-5 h-5 text-white opacity-60" }} />
          </div>
        </div>

        <!-- Status -->
        <div class="my-2 py-1.5 flex items-center justify-between">
          <div class="flex items-center">
            <!-- Icon -->
            <Icon name="info" attrs={{ class: "w-5 h-5 text-white opacity-60 mr-2" }} />

            <!-- Text -->
            <div>
              <h2 class="text-sm text-white font-medium">Статус</h2>
              <p class="text-xs text-white opacity-70">Выбранно: закончен, заморожен</p>
            </div>
          </div>

          <div>
            <Icon name="chevron-right" attrs={{ class: "w-5 h-5 text-white opacity-60" }} />
          </div>
        </div>

        <!-- Size -->
        <div class="my-2 py-1.5 flex items-center justify-between">
          <div class="flex items-center">
            <!-- Icon -->
            <Icon name="align-center" attrs={{ class: "w-5 h-5 text-white opacity-60 mr-2" }} />

            <!-- Text -->
            <h2 class="text-sm text-white font-medium">Размер</h2>
          </div>

          <div>
            <Icon name="chevron-right" attrs={{ class: "w-5 h-5 text-white opacity-60" }} />
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Content -->
  <Container background="light-dark" type="full" classes="overflow-y-scroll">
    <!-- Explorer -->
    <Container background="light-dark" classes="px-6 mt-4">
      <!-- Title -->
      <Container background="light-dark" classes="mb-2 px-2" size="two-thirds">
        <Heading size="xl">Исследовать</Heading>
        <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est iusto quia odit nam exercitationem quae quis amet hic ratione ipsum!</Paragraph>
      </Container>

      <!-- List Categories -->
      <Container background="light-dark" flex="between">
        <Container background="light-dark" flex="flex">
          { #if exploreBadges }
            { #each exploreBadges as badge }
              <div class="mx-1 px-2 py-1 rounded-full flex items-center justify-center bg-gray-500">
                <p class="text-sm text-white font-medium">{ badge.title }</p>
              </div>
            { /each }
          { /if }

          <!-- <div class="mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-blue-500">
            <p class="mr-2 text-md text-white font-medium">Новые рассказы</p>

            <Icon name="x" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "3" }} />
          </div> -->
        </Container>
        
        <div class="mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-900 bg-opacity-70">
          <Icon name="more-horizontal" attrs={{ class: "w-4 h-4 text-white mr-2", "stroke-width": "3" }} />

          <p class="text-md text-white font-medium">Больше</p>
        </div>
      </Container>
    </Container>

    <!-- Book list -->
    <Container background="light-dark" size="full" flex="flex" classes="flex-wrap relative p-6">
      { #if books }
        { #each books.docs as entry }
          <BookCard book="{ entry }" type="default" size="base" />
        { /each }
      { /if }
    </Container>

    <!-- Footer -->
    <Footer />

  </Container>
</Container>