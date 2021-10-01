<script lang="ts">
  // Importing modules
  import Icon from "src/components/Icon.svelte";

</script>

<svelte:head>
  <title>Pawcapsu Services</title>
</svelte:head>

<!-- Main landing area -->
<!-- Hero -->
<section class="w-full h-screen flex items-center justify-center bg-gray-900">
  <!-- Text -->
  <div class="w-1/3 px-12">
    <h1 class="text-7xl text-white font-bold">Lorem ipsum dolor sit amet.</h1>
    <p class="mt-2 text-base text-white opacity-80">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab natus expedita saepe amet asperiores qui voluptas. Unde excepturi, cum maxime saepe enim nulla numquam, quaerat laborum aperiam necessitatibus alias officiis perferendis suscipit vero ipsum vel. Sit saepe cupiditate consectetur eveniet eius eos accusamus voluptates mollitia perspiciatis, repellat unde ex corporis?</p>
  
    <!-- Buttons -->
    <div class="mt-6 w-full">
      <!-- Explore Services -->
      <button class="rounded-md w-full flex items-center justify-between bg-indigo-500 py-2 px-4">
        <div class="flex items-center">
          <Icon name="compass" attrs={{ class: "w-6 h-6 text-white" }} />
          
          <p class="ml-2 text-xl text-white font-medium">Explore Services</p>
        </div>

        <!-- Servieces count -->
        <div>
          <div class="bg-gray-900 px-3 py-2 rounded-xl">
            <p class="text-sm text-white font-medium opacity-80">1 Service</p>
          </div>
        </div>
      </button>

      <!-- Suggest an Idea -->
      <button class="mt-4 cursor-not-allowed rounded-md w-full flex items-center justify-start opacity-50 bg-gray-700 py-3 px-4">
        <Icon name="send" attrs={{ class: "w-6 h-6 text-white" }} />
          
        <p class="ml-2 text-xl text-white font-medium">Suggest an Idea</p>
      </button>
    </div>
  </div>

  <!-- Services -->
  <div class="w-2/3">

  </div>
</section>

<!-- Services -->
<section class="w-full py-16">
  <!-- Header -->
  <div class="w-full flex items-center justify-between px-12">
    <!-- Title -->
    <div class="w-1/3">
      <div class="flex items-center justify-start">
        <h1 class="mr-2 text-black text-5xl font-bold">Services</h1>
        
        <div class="bg-gray-900 px-3 py-2 rounded-xl">
          <p class="text-sm text-white font-bold">1 Available</p>
        </div>
      </div>

      <p class="text-base text-black opacity-80">Lorem ipsum dolor sit amet consectetur.</p>
    </div>

    <!-- Search bar -->
    <div class="w-1/3 flex items-center justify-center">
      <div class="w-full bg-gray-900 rounded-xl px-4 py-3 flex items-center">
        <!-- Icon -->
        <Icon name="search" attrs={{ class: "w-5 h-5 text-white opacity-60", "stroke-width": "3" }} />
      
        <!-- Search text -->
        <p class="text-white text-md ml-2 opacity-60">Search services...</p>
      </div>
    </div>
  </div>

  <!-- Services -->
  <div class="mt-8 w-full flex flex-wrap px-8">

    <!-- Leggydog -->
    <div class="w-1/4 relative" style="padding-bottom: 25%;">
      <div class="absolute w-full h-full p-2">
        <div style="z-index: 2;" class="w-full h-full rounded-xl bg-gray-900 flex flex-col items-center justify-start p-4">
          <!-- Bot header -->
          <div class="w-full flex items-center justify-between">
            <!-- Title -->
            <div class="flex items-center justify-center">
              <img class="w-8 h-8 rounded-full" src="https://thumbs.dreamstime.com/b/brown-dog-long-legs-standing-gray-sand-shaggy-69298719.jpg" alt="leggydog bot profile picture">

              <h1 class="ml-2 text-xl text-white font-medium">Leggydog</h1>
            </div>

            <!-- Tags -->
            <div class="flex items-center justify-center">
              <div class="rounded-xl bg-indigo-500 px-2 py-1">
                <p class="text-md text-white opacity-80">Telegram Bot</p>
              </div>
            </div>
          </div>

          <!-- Information -->
          <div class="mt-6">
            <p class="text-md text-white opacity-70">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet modi aspernatur reprehenderit nostrum dolorum laboriosam numquam perspiciatis ea temporibus magnam eaque architecto, qui magni consequatur, minima dolor, eius quam molestiae veritatis aliquam libero sapiente.</p>
          </div>

          <!-- Buttons -->
          <div class="p-4 absolute inset-x-0 bottom-0 w-full flex items-stretch justify-center">
            <!-- Chat -->
            <button class="mr-2 rounded-md w-1/2 flex items-center justify-start bg-indigo-500 py-2 px-4">
              <Icon name="message-circle" attrs={{ class: "w-5 h-5 text-white" }} />
              
              <p class="ml-1.5 text-md text-white font-medium">Go to chat</p>
            </button>
            
            <!-- Learn more -->
            <button class="ml-2 cursor-not-allowed rounded-md w-1/2 flex items-center justify-start opacity-70 bg-gray-800 py-2 px-4">
              <Icon name="link" attrs={{ class: "w-5 h-5 text-white" }} />
                
              <p class="ml-1.5 text-md text-white font-medium">Learn more</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggest service -->
    <div class="w-1/4 relative" style="padding-bottom: 25%;">
      <div class="absolute w-full h-full p-2">
        <div style="z-index: 2;" class="w-full h-full rounded-xl bg-gray-900 flex flex-col items-center justify-center p-4">
          <div class="text-center">
            <h1 class="text-xl text-white font-medium">Заинтересовали?</h1>

            <p class="mt-4 text-sm text-white opacity-75">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, nobis!</p>
          </div>

          <!-- Button -->
          <div class="mt-4">
            <button class="mt-4 cursor-not-allowed rounded-md w-full flex items-center justify-start opacity-50 bg-gray-700 py-3 px-4">
              <Icon name="send" attrs={{ class: "w-5 h-5 text-white" }} />
                
              <p class="ml-2 text-md text-white">Suggest an Idea</p>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>