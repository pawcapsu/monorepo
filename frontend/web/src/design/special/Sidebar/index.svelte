<script lang="typescript">
  // Importing modules
  import { SidebarState } from '$stores/sidebar';
  import type { SidebarStateStore } from '$stores/sidebar';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  import Icon from 'src/components/Icon.svelte';
  import Container from 'src/design/layout/Container/index.svelte';
  
  let updateAnimation = false;
  let previousState: string;

  SidebarState.subscribe((currentState) => {
    if (previousState != currentState?.state) {
      previousState = currentState.state;

      updateAnimation = true;
      
      setTimeout(() => {
        updateAnimation = false;
      }, 250);
    };
  });
  
  $: size = $SidebarState.state == 'in-reader' ? 8 : 10;
</script>

<!-- Sidebar -->
<Container classes="px-{ $SidebarState.state == 'in-reader' ? '2' : '3' } py-2 h-screen flex flex-col items-center justify-between relative { $SidebarState.state == 'in-reader' ? 'opacity-60' : '' }">
  <!-- Update animation -->
  { #if updateAnimation }
    <div out:fade={{ duration: 800 }} class="absolute z-50 w-full h-screen bg-gray-900"></div>
  { /if }

  <!-- Content -->
  <div class="flex flex-col items-center">
    <!-- Account Icon -->
    <div class="my-1.5 w-{size} h-{size} rounded-full flex items-center justify-center" style="background: url('https://cdn.discordapp.com/banners/155749532615966720/cac172ea1db4be9f83dfc7232062e944.png?size=512'); background-position: center; background-size: cover;"></div>
    
    <!-- Services page -->
    <div class="my-2 relative group">
      <div class="rounded-full my-2 w-{size} h-{size} bg-gray-500 flex items-center justify-center relative">
        <Icon name="grid" attrs={{ class: `w-${size/2} h-${size/2} text-white`, "stroke-width": "2.5" }} />
      </div>
    
      <!-- Arrow -->
      <div style="z-index: 2; margin-right: -3.8rem; margin-top: 0.75rem;" class="hidden group-hover:block rotate-45 top-0 right-0 w-10 h-10 bg-gray-900 absolute"></div>
    
      <!-- Side panel -->
      <div style="z-index: 2; margin-right: -14.5rem;" class="w-52 hidden group-hover:block shadow-2xl absolute rounded-md p-2 top-0 right-0 bg-gray-900">
        <!-- Place Title -->
        <div>
          <div class="flex items-center">
            <h1 class="text-md text-white font-bold">Сервисы</h1>
          </div>
    
          <p class="text-xs text-white opacity-70">Другие наши крутые сервисы и сайты...</p>
        </div>
    
        <!-- Example services -->
        <!-- leggydog -->
        <div class="w-full flex items-center my-4">
          <!-- Logotype -->
          <div class="w-6 h-6 rounded-full bg-green-500"></div>

          <!-- Info -->
          <div class="ml-1.5">
            <h1 class="text-sm text-white">Leggydog Bot</h1>
            <p class="text-xs text-white opacity-70">Дилер 18+ контента</p>
          </div>
        </div>

        <!-- ctrlpaint -->
        <div class="w-full flex items-center my-4">
          <!-- Logotype -->
          <div class="w-6 h-6 rounded-full bg-yellow-500"></div>

          <!-- Info -->
          <div class="ml-1.5">
            <h1 class="text-sm text-white">CtrlPaint.ru</h1>
            <p class="text-xs text-white opacity-70">Русские уроки рисования</p>
          </div>
        </div>

        <!-- odzi dog -->
        <div class="w-full flex items-center my-4">
          <!-- Logotype -->
          <div class="w-6 h-6 rounded-full bg-blue-500"></div>

          <!-- Info -->
          <div class="ml-1.5">
            <h1 class="text-sm text-white">odzi dog</h1>
            <p class="text-xs text-white opacity-70">Сервисы для собачников</p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="w-full items-center justify-center relative">
          <!-- More services -->
          <div class="mr-1 w-full rounded-md bg-gray-800 py-1 flex items-center justify-center text-white text-xs font-bold">
            Больше сервисов
          </div>
        </div>
      </div>
    </div>

    <!-- Explore Page -->
    <div on:click={() => {
      goto('/app/place/explore');
    }} class="my-1.5 w-{size} h-{size} ring-2 ring-blue-400 rounded-full bg-gray-500 flex items-center justify-center relative">
      <Icon name="compass" attrs={{ class: `w-${size/2} h-${size/2} text-white`, "stroke-width": "3" }} />

      <div class="absolute top-0 right-0" style="margin-top: -5px; margin-right: -5px;">
        <div class="w-{size/2} h-{size/2} bg-red-400 rounded-full"></div>
      </div>
    </div>

    <!-- Divider -->
    <div style="height: 3px;" class="mt-2 opacity-30 w-10 bg-gray-600 rounded-full"></div>
  
    <!-- Places info -->
    <div class="my-2 relative group">
      <div class="rounded-full my-2 w-{size} h-{size} bg-green-500 flex items-center justify-center relative">
        <Icon name="box" attrs={{ class: `w-${size/2} h-${size/2} text-white`, "stroke-width": "3" }} />
      </div>
    
      <!-- Arrow -->
      <div style="z-index: 2; margin-right: -3.8rem; margin-top: 0.75rem;" class="hidden group-hover:block rotate-45 top-0 right-0 w-10 h-10 bg-gray-900 absolute"></div>
    
      <!-- Side panel -->
      <div style="z-index: 2; margin-right: -14.5rem;" class="w-52 shadow-2xl hidden group-hover:block absolute rounded-md p-2 top-0 right-0 bg-gray-900">
        <!-- Place Title -->
        <div>
          <div class="flex items-center">
            <h1 class="text-md text-white font-bold">Плейсы</h1>
          </div>
    
          <p class="text-xs text-white opacity-70">Невероятно крутая штука, которая ещё в разработке!</p>
        </div>
        
        <div class="my-4">
          <p class="text-xs text-white opacity-70">Плейсы - это невероятно крутая штука, которая на данный момент находится в разработке. Это - место для общения любителей определённых жанров, авторов, картин/книг и вообщем всего того, что есть на сайте!<br /><br />Ещё находится в разработке, но уже скоро будет доступно! Так что осталось просто подождать...</p>
        </div>
      </div>
    </div>
    <!-- <div style="background: url('https://cdn.discordapp.com/icons/794490811639267339/f63b8efdecb1930a6ecfb98512547362.png?size=128'); background-size: cover; background-position: center;" class="rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative">
    </div> -->
  </div>

  <!-- Settings -->
  <div class="flex flex-col items-center">
    <div class="my-1.5 w-{size} h-{size} rounded-full bg-gray-500 flex items-center justify-center">
      <Icon name="settings" attrs={{ class: `w-${size/2} h-${size/2} text-white`, "stroke-width": "2.5" }} />
    </div>
  </div>
</Container>