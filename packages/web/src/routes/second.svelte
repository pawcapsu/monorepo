<!-- Writings -->
<section id="writings" class="bg-gray-800 overflow-hidden overflow-y-auto w-full h-screen flex justify-center items-center px-8">
  <!-- Texts -->
  <div class="w-1/2 px-3">
    <h1 class="text-5xl text-gray-100 font-bold">Огромное количество рассказов</h1>
    <p class="mt-2 text-xl text-gray-100 opacity-75">Наша платформа собирает рассказы с все известных русскоязычных сайтов, так что вы всегда сможете хоть что-то найти!</p>

    <!-- Buttons -->
    <div class="w-2/3 mt-6">
      <div class="flex justify-center items-center w-full relative">
        <!-- Start -->
        <button class="flex w-1/2 items-center justify-center py-2 rounded-md bg-indigo-400">
          <p class="text-sm text-white font-medium">Начать исследовать</p>
        </button>

        <!-- More -->
        <button class="cursor-not-allowed opacity-60 ml-4 w-1/2 flex items-center justify-center py-2 rounded-md bg-indigo-400">
          <p class="text-sm text-white font-medium">Узнать больше</p>
        </button>
      </div>

      <!-- Text -->
      <p class="mt-1 text-xs text-gray-100 opacity-60">Продолжая, вы соглашаетесь с Правилами пользования</p>
    </div>
  </div>

  <!-- Content -->
  <div class="w-1/2 h-full relative px-3">
    <div style="z-index: 2;" class="absolute inset-0 w-full h-full"></div>
    <div style="overflow: hidden; z-index: 1; width: 125%; right: 5vw;" id="content-container" class="transform -skew-y-12 rotate-12 flex flex-wrap absolute inset-0 h-full rounded-md bg-dark">
      { #each testData as entry }
        <div class="w-1/2 p-2 relative">
          <div style="z-index: 2;" class="w-full h-full rounded-xl bg-gray-900 p-4">
            <!-- Title -->
            <div class="mb-2">
              <div class="flex items-center mt-0.5 opacity-70 text-white">
                <Icon name="link-2" attrs={{ class: "w-4 h-4" }} />
                
                <p class="ml-1.5 text-xs">Гарри Поттер</p>
              </div>

              <h1 class="text-3xl text-white font-medium">Невероятно крутой рассказ который прям вау...</h1>
            
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
            </div>

            <!-- Description -->
            <div class="text-sm text-white opacity-70">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores ipsam aliquam, atque eos hic autem tempore. Iusto ipsa sint laboriosam inventore dolor, illo ex cum vitae tenetur sed impedit ut modi veniam ducimus numquam vel dolores delectus aperiam cumque adipisci, nam placeat voluptatum sequi! Ex ipsam minus illo rem fugit.  
            </div>
          </div>
        </div>
      { /each }  
    </div>
  </div>
</section>

<!-- Groups -->
<section id="groups" class="bg-gray-800 w-full h-screen flex justify-center items-center">

</section>