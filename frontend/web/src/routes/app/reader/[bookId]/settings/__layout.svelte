<script lang="typescript">
  // Importing modules
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from 'src/components/Icon.svelte';

  // Categories list
  const categories = [
    {
      id: 'book',
      title: 'Про книгу',
      description: 'Про книгу, которую вы читаете',
      icon: 'book',
      color: 'indigo-500',
    },  
    {
      id: 'view',
      title: 'Вид',
      description: 'Описание категории настроек',
      icon: 'feather',
      color: 'yellow-500',
    },
    {
      id: 'text',
      title: 'Текст',
      description: 'Описание категории настроек',
      icon: 'align-center',
      color: 'pink-500',
    },
  ];

  let currentCategory: Partial<{ id: string, title: string, description: string }>;
  let mobileCurrentCategory: string;

  // Subscribing to page store to
  // determine currentCategory
  page.subscribe((currentPage) => {
    const pathSplitted = currentPage.path.split('/');
    currentCategory = categories.find((x) => x.id == pathSplitted[pathSplitted.length - 1]);
  });

  // Function to change current settings pane to something else
  function changeCurrentPane(toCategory: string) {
    goto(toCategory);

    // Changing mobileCurrentCategory
    setTimeout(() => {
      mobileCurrentCategory = toCategory;
    }, 150);
  };
</script>

<div class="w-full h-full md:flex relative">
  <!-- Mobile-only: controls -->
  <div class="w-full md:hidden py-4 flex items-center justify-center">
    <div on:click={() => {
      // openActionWindow('settings');
    }} class="cursor-pointer mx-1 px-3 py-1 rounded-full bg-gray-700 opacity-80 flex items-center justify-center">
      <Icon name="chevron-up" attrs={{ class: "w-4 h-4 text-white ml-1", "stroke-width": "2" }} />
      
      <p class="text-sm text-white font-medium ml-1.5">Закрыть</p>
    </div>
  </div>

  <!-- Sidebar -->
  <div class="w-full { mobileCurrentCategory ? 'z-10' : 'z-20' } absolute bg-gray-900 md:relative md:w-1/5 flex flex-col h-full md:border-r-2 md:border-gray-800">
    <!-- Categories -->
    <div class="flex items-start overflow-y-auto flex-wrap">
      { #each categories as category }
        <div on:click={() => {
          changeCurrentPane(category.id)
        }} class="mx-2 my-1.5 md:my-4 w-full md:w-auto flex md:block p-4 md:p-0 cursor-pointer rounded-xl { currentCategory?.id == category.id ? `bg-${ category.color } md:bg-transparent` : 'bg-gray-800 md:bg-transparent'  }">
          <div class="md:w-20 md:h-20 rounded-xl { currentCategory?.id == category.id ? `bg-${ category.color }` : 'bg-gray-800' } flex items-center justify-center">
            <Icon name="{ category.icon }" attrs={{ class: "w-8 h-8 text-white", "strike-width": "3" }} />
          </div>

          <div class="ml-2 md:m-0">
            <h1 class="md:mt-2 text-lg md:text-sm text-white font-medium md:font-normal md:opacity-80 md:text-center">{ category.title }</h1>

            <!-- Mobile-only: description -->
            <p class="text-xs md:hidden text-white opacity-80">{ category.description }</p>
          </div>
        </div>
      { /each }
    </div>
  </div>

  <!-- Category Content -->
  <div class="{ mobileCurrentCategory ? 'z-20' : 'z-10' } bg-gray-900 w-full absolute md:relative md:w-4/5 h-full flex flex-col md:pl-6 px-2">
    <!-- Mobile-only: back to category selection -->
    <div on:click={() => {
      mobileCurrentCategory = null;
    }} class="md:hidden flex items-center cursor-pointer w-full rounded-xl bg-gray-800 p-4 mb-6">
      <!-- Icon -->
      <Icon name="chevron-left" attrs={{ class: "w-6 h-6 text-white", "stroke-width": "3" }} />

      <!-- Text -->
      <div class="ml-2">
        <h1 class="text-lg text-white font-medium">Вернуться назад</h1>
        <p class="text-xs text-white opacity-80">Вернуться назад к Настройкам</p>
      </div>
    </div>

    <!-- Category header -->
    <div class="w-full mb-6">
      <div>
        <h1 class="text-3xl text-white font-medium">{ currentCategory?.title }</h1>
        <p class="text-normal text-white opacity-80">{ currentCategory?.description }</p>
      </div>
    </div>

    <div class="w-full flex-grow overflow-y-auto">
      <slot />
    </div>
  </div>
</div>