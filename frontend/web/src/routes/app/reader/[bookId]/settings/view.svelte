<script lang="typescript">
  // Importing modules
  import Icon from 'src/components/Icon.svelte';
</script>

<!-- Theme switcher -->
<div class="w-full">
  <!-- Setting header -->
  <div class="w-full md:w-2/3 mb-4">
    <h1 class="text-xl text-white font-medium">Тема читалки</h1>
    <p class="text-sm text-white opacity-80">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, obcaecati.</p>
  </div>
  
  <div class="w-full flex flex-wrap md:flex-nowrap items-stretch">
    <!-- Light -->
    <div class="w-full my-2 md:my-0 flex items-center md:w-1/3 p-4 rounded-xl bg-white bg-opacity-70">
      <!-- Icon -->
      <div class="">
        <Icon name="sun" attrs={{ class: "w-6 h-6 text-black", "stroke-width": "2.5" }} />
      </div>

      <!-- Text -->
      <div class="ml-4">
        <h1 class="text-md text-black font-medium">Светлая тема</h1>
        <p class="text-xs text-black">Lorem ipsum dolor sit amet.</p>
      </div>
    </div>

    <!-- Dark -->
    <div class="w-full my-2 md:my-0 flex items-center md:w-1/3 p-4 rounded-xl md:mx-4 bg-black border-2 border-indigo-500 border-solid bg-opacity-70 relative">
      <!-- Badge -->
      <div style="margin-top: -1rem; margin-right: -1rem;" class="absolute right-0 top-0">
        <div class="bg-indigo-500 rounded-full px-3 py-1.5 flex items-center">
          <p class="text-sm text-white">Выбранно</p>

          <Icon name="check" attrs={{ class: "ml-1.5 w-4 h-4 text-white", "stroke-width": "2.5" }} />
        </div>
      </div>

      <!-- Icon -->
      <div class="">
        <Icon name="moon" attrs={{ class: "w-6 h-6 text-white", "stroke-width": "2.5" }} />
      </div>

      <!-- Text -->
      <div class="ml-4">
        <h1 class="text-md text-white font-medium">Тёмная тема</h1>
        <p class="text-xs text-white">Lorem ipsum dolor sit amet.</p>
      </div>
    </div>

    <!-- Custom themes -->
    <div class="w-full my-2 md:my-0 flex items-center md:w-1/3 p-4 rounded-xl border-4 border-dashed border-gray-800 bg-opacity-70">
      <!-- Icon -->
      <div class="">
        <Icon name="feather" attrs={{ class: "w-6 h-6 text-white", "stroke-width": "2.5" }} />
      </div>

      <!-- Text -->
      <div class="ml-4">
        <h1 class="text-md text-white font-medium">Польз. темы</h1>

        <div class="flex items-center opacity-80">
          <Icon name="alert-triangle" attrs={{ class: "w-3 h-3 text-white", "stroke-width": "2.5" }} />

          <p class="text-xs text-white ml-1">Находится в разработке</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Viewport size -->