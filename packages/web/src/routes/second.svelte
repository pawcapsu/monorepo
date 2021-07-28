<!-- Channel logotype -->
<div class="w-full pt-4 pb-2 px-4 relative flex flex-col">
  <!-- Title -->
  <div>
    <h1 class="text-xl text-white font-bold">Клуб Гарри Поттера</h1>

    <div class="cursor-pointer flex items-center mt-0.5">
      <Icon name="external-link" attrs={{ class: "w-4 h-4 text-white mr-1.5" }} />
      <p class="text-sm text-white opacity-60">"Гарри Поттер"</p>
    </div>
  </div>
</div>

<!-- Actions -->
<div class="mb-2 px-4">
  <!--  -->
  <div class="my-4 flex items-center">
    <!-- Icon -->
    <Icon name="search" attrs={{ class: "w-4 h-4 text-white", "stroke-width": "3" }} />

    <!-- Text -->
    <p class="ml-2 text-white font-medium">Поиск</p>
  </div>

  <div class="my-4 flex items-center">
    <!-- Icon -->
    <Icon name="book" attrs={{ class: "w-4 h-4 text-white", "stroke-width": "3" }} />

    <!-- Text -->
    <p class="ml-2 text-white font-medium">К рассказу</p>
  </div>
</div>

<!-- Divider -->
<div class="px-4 w-full relative">
  <div style="height: 3px;" class="w-full bg-gray-500 opacity-20 rounded-full"></div>
</div>

<!-- Channel list -->
<div class="mt-2 px-2 flex-grow">

  <!-- Ordinary channel #1 -->
  <div class="my-2 w-full flex items-center relative rounded-xl py-2 px-2 bg-gray-500 bg-opacity-30">
    <!-- Icon + text -->
    <div class="flex items-center w-2/3">
      <!-- Icon -->
      <img class="w-5 h-5 mr-1.5" src="./icons/victory-hand.png" alt="">

      <!-- Text -->
      <p class="text-md text-white font-medium">Главный</p>
    </div>

    <!-- Messages -->
    <div class="w-1/3 items-center flex justify-end">
      <div class="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
        <p class="text-sm text-white font-medium">1</p>
      </div>
    </div>
  </div>

  <!-- Ordinary channel #2 -->
  <div class="my-2 w-full flex items-center relative rounded-xl py-2 px-2">
    <!-- Icon + text -->
    <div class="flex items-center w-2/3">
      <!-- Icon -->
      <img class="w-5 h-5 mr-1.5" src="./icons/hot-beverage.png" alt="">

      <!-- Text -->
      <p class="text-md text-white font-medium">Чаепитие</p>
    </div>
  </div>

  <!-- Group
  <div class="mb-2 mt-4">
    #Group title
    <div class="w-full flex items-center text-white opacity-50">
      #Icon
      <Icon name="chevron-down" attrs={{ class: "w-4 h-4 mr-1.5", "stroke-width": "3" }} />

      #Text
      <p class="text-sm">Категория</p>
    </div>

    #Group channels
    <div class="mt-1.5">
      <div class="my-2 w-full flex items-center relative rounded-xl py-2 px-2">
        #Icon + text
        <div class="flex items-center w-2/3">
          #Icon
          <img class="w-5 h-5 mr-1.5" src="./icons/eggplant.png" alt="">

          #Text
          <p class="text-md text-white font-medium">Запрещённое</p>
        </div>
      </div>
    </div>

  </div> -->

</div>