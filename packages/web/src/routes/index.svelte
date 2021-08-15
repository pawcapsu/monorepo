<script>
  // Importing modules
  import { UserStore } from '$stores/user';

	// Importing components
  import Icon from '../components/Icon.svelte';
  import { goto } from "$app/navigation";

	// Test Data
	let testData = [1,2,3,4,5,6,7,8,9];
</script>

<!-- Header -->

<!-- Main landing area -->
<section class="bg-gray-900 w-full h-screen flex justify-center items-center relative">
  <!-- Text + Logotype -->
  <div class="w-1/2 px-12">
    <!-- Logotype -->
    <div class="flex items-center">
      <img class="w-10 h-10" src="https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg" alt="">
   
      <p class="ml-2 text-3xl font-bold text-white">pawcapsu</p>
    </div>

    <!-- Texts -->
    <div class="my-6">
      <h1 class="text-5xl text-white font-bold">Новый, <span class="bg-indigo-500 px-1">Социальный</span> фикрайтинг</h1>
    
      <p class="py-2 text-md text-white opacity-80">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo, delectus debitis ut excepturi repellat fuga sequi enim vero corporis dolores blanditiis pariatur reiciendis modi rerum! Аниме на аве мать в канаве</p>
    </div>

    <!-- Buttons -->
    <div class="w-full flex items-center justify-center relative">
      { #if $UserStore.user }
        <button on:click={() => {
          goto('/app');
        }} class="w-1/2 mr-4 bg-indigo-500 rounded-md py-2 flex items-center justify-center">
          <p class="text-white">Перейти к приложению</p>
        </button>
      { :else }
        <button on:click={() => {
          goto('/login/link');
        }} class="w-1/2 mr-4 bg-indigo-500 rounded-md py-2 flex items-center justify-center">
          <p class="text-white">Авторизоваться</p>

          <Icon name="user" attrs={{ class: "w-4 h-4 text-white ml-2" }} />
        </button>
      { /if }

      <button class="w-1/2 bg-gray-800 rounded-md py-2 flex items-center justify-center">
        <p class="text-white">Хз что</p>
      </button>
    </div>
  </div>

  <!-- Popular books library -->
  <div class="w-1/2 overflow-hidden overflow-y-auto ml-1 bg-gray-800 h-full flex flex-col relative">
    <!-- Books -->
    <div class="w-full flex flex-wrap flex-grow px-12 py-12">
      { #each testData as entry }
        <div class="w-1/2 p-2 relative">
          <div style="z-index: 2;" class="w-full h-full rounded-xl bg-gray-900 p-4">
            <!-- Title -->
            <div class="mb-2">
              <div class="flex items-center mt-0.5 opacity-70 text-white">
                <Icon name="link-2" attrs={{ class: "w-4 h-4" }} />
                
                <p class="ml-1.5 text-xs">Гарри Поттер</p>
              </div>

              <h1 class="text-xl text-white font-medium">Невероятно крутой рассказ который прям вау...</h1>
            </div>

            <!-- Description -->
            <div class="text-sm text-white opacity-70">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, quo reprehenderit. Facere porro odio cum, repudiandae omnis ipsa amet corporis quos qui! Sed voluptatem dolorum repudiandae? Fugit rem aspernatur ratione.  
            </div>
          </div>
        </div>
      { /each }
      
      <div class="w-1/2 p-2 relative">
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

  <!-- Dots -->
  <div class="absolute inset-x-0 bottom-0 w-full py-4 flex items-center justify-center">
    <div class="w-3 h-3 rounded-full bg-white mx-2"></div>
    <a href="#writings" class="w-2 h-2 rounded-full border-2 border-white mx-2"></a>
    <a href="#groups" class="w-2 h-2 rounded-full border-2 border-white mx-2"></a>
  </div>
</section>