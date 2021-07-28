<script>
  import Icon from '../components/Icon.svelte';
</script>

<div class="flex">
  <!-- Sidebar -->
  <div class="px-3 py-2 bg-gray-800 h-screen flex flex-col items-center justify-between">
    <div class="flex flex-col items-center">
      <!-- Account Icon -->
      <div class="my-1.5 w-12 h-12 rounded-full flex items-center justify-center" style="background: url('https://cdn.discordapp.com/banners/155749532615966720/cac172ea1db4be9f83dfc7232062e944.png?size=512'); background-position: center; background-size: cover;"></div>
      
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
    
      <div style="background: url('https://cdn.discordapp.com/icons/846488670046781490/a_5830499ede6d67378121769c9a11027a.png?size=128'); background-size: cover; background-position: center;" class="rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative">
      </div>
    
      <div class="my-2 w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center relative">
        <div style="background: url('https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg'); background-position: center; background-size: 50%; background-repeat: no-repeat;" class="absolute rounded-full w-full h-full"></div>
      </div>

      <div class="my-2 relative">
        <div style="background: url('https://cdn.discordapp.com/icons/733758953208676383/99ae171e7bdb006d6dcd0f5887ad3835.png?size=128'); background-size: cover; background-position: center;" class="rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative">
        </div>

        <!-- Arrow -->
        <div style="z-index: 2; margin-right: -3.8rem; margin-top: 0.75rem;" class="rotate-45 top-0 right-0 w-10 h-10 bg-gray-900 absolute"></div>

        <!-- Side panel -->
        <div style="z-index: 2; margin-right: -14.5rem;" class="w-52 shadow-2xl absolute rounded-md p-2 top-0 right-0 bg-gray-900">
          <!-- Place Title -->
          <div>
            <div class="flex items-center">
              <h1 class="text-md text-white font-bold">fictale</h1>
            </div>

            <p class="text-xs text-white opacity-70">Убийца всех и вся. Отец демократии и мать тво...</p>
          </div>

          <!-- Place Statistics -->
          <div class="my-4">
            <!-- Members -->
            <div class="flex items-center">
              <!-- Icons -->
              <div class="flex items-center relative w-14">
                <!-- background: url(''); background-size: cover; background-position: center; -->
                <div style="" class="absolute rounded-full w-6 h-6 bg-red-500"></div>
                <div style="margin-left: 0.8rem;" class="absolute rounded-full w-6 h-6 bg-green-500"></div>
                <div style="margin-left: 1.8rem;" class="absolute rounded-full w-6 h-6 bg-blue-500"></div>
              </div>

              <!-- Text -->
              <div class="ml-2">
                <h2 class="text-sm text-white font-medium">5000 участников</h2>
                <p class="text-xs text-white opacity-70">Из них 3 друга</p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="w-full flex items-center justify-center relative">

            <!-- Open place -->
            <div class="mr-1 w-1/2 rounded-md bg-gray-800 py-1 flex items-center justify-center text-white text-xs font-bold">
              Чёто
            </div>

            <!-- Open book -->
            <div class="ml-1 w-1/2 rounded-md bg-gray-800 py-1 flex items-center justify-center text-white text-xs font-bold">
              Чёто #2
            </div>
          </div>
        </div>
      </div>

    </div>
      
    <!-- Settings -->
    <div class="flex flex-col items-center">
      <div class="my-1.5 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
        <Icon name="settings" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "2.5" }} />
      </div>
    </div>
  </div>

  <!-- Channels -->
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
  <section class="w-full h-screen bg-gray-800 bg-opacity-90 p-4">
    
    <!-- Promoted -->
    <div class="w-full flex items-stretch p-6">

      <!-- Three promoted books -->
      <div class="w-2/3 relative flex items-stretch">
        <!-- Entry -->
        <div class="w-1/2 p-2 relative">
          <div style="z-index: 2;" class="w-full h-full rounded-xl bg-gray-900 bg-opacity-60 p-4">

            <!-- Author -->
            <div class="w-full flex items-center justify-between">
              <!-- Author and fandom -->
              <div class="py-1.5 px-3">
                <!-- Author -->
                <div class="flex items-center">
                  <div class="bg-red-500 rounded-full w-7 h-7"></div>

                  <div class="ml-2">
                    <h2 class="text-sm text-white font-medium">Март Доглиш</h2>
                    <p class="text-xs text-white opacity-70">Lorem, ipsum dolor.</p>
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div>
                <Icon name="more-horizontal" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "3" }} />
              </div>
            </div>

            <!-- Title -->
            <div class="mt-8 mb-2">
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

            <!-- Buttons -->
            <div class="mt-8 w-full flex items-center">
              <div class="mr-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center">
                <p class="text-white font-medium">Читать</p>
              </div>

              <div class="ml-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center">
                <p class="text-white font-medium">На потом</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Entry #2 -->
        <div class="w-1/2 p-2 relative">
          <div style="background-image: url('./cover.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center;" class="w-full h-full rounded-xl bg-gray-900 p-4">
            <!-- Author -->
            <div class="w-full flex items-center justify-between">
              <!-- Author and fandom -->
              <div class="px-3 py-1.5 rounded-xl bg-gray-900 bg-opacity-60">
                <!-- Author -->
                <div class="flex items-center">
                  <div class="bg-red-500 rounded-full w-7 h-7"></div>

                  <div class="ml-2">
                    <h2 class="text-sm text-white font-medium">Март Доглиш</h2>
                    
                    <div class="flex items-center opacity-70 text-white">
                      <Icon name="link-2" attrs={{ class: "w-4 h-4" }} />
                      
                      <p class="ml-1.5 text-xs">Гарри Поттер</p>
                    </div>      
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div>
                <Icon name="more-horizontal" attrs={{ class: "w-5 h-5 text-white", "stroke-width": "3" }} />
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- New books -->
      <div class="w-1/3 relative p-2">
        <div class="w-full bg-gray-900 h-full">
          da
        </div>
      </div>

    </div>

    <!-- Posts -->
    <div class="flex flex-wrap">

    </div>

  </section>
</div>