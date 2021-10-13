<script>
  import "../app.postcss";
  import { UserStore } from '$stores/user/User.store';
  import { onMount } from 'svelte';

  onMount(() => {
    UserStore.authMe();
  });
</script>

{ #if $UserStore.loaded }
  <slot></slot>

  <!-- Footer -->
  <div class="w-full bg-gray-800 p-16 flex items-center">
    <!-- Company -->
    <div class="w-1/3">
      <!-- Logotype -->
      <div class="flex items-center">
        <img class="w-9 h-9" alt="odzi company logotype" src="https://res.cloudinary.com/lococovu-cdn/image/upload/v1610999988/logotypes/odzi-dog-small-white.svg" />
     
        <div class="ml-4">
          <h1 class="text-xl text-white font-bold">odzi company</h1>
          <p class="text-xs text-white opacity-80">Lorem ipsum dolor sit amet consectetur.</p>
        </div>
      </div>

      <!-- Info -->
      <div class="mt-4">
        <p class="text-xs text-white opacity-60">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente laudantium debitis est libero at dolore non iste ipsa labore, aliquam odit, accusamus eveniet, amet voluptates!</p>
        
        <!-- Legal info -->
        <p class="mt-4 text-xs text-white opacity-50">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
    </div>

    <!-- Links -->
    <div class="w-2/3 flex items-start justify-end">
      <!-- Services -->
      <div class="mx-8">
        <h1 class="text-md text-white font-medium opacity-80">Services</h1>

        <div class="mt-2 flex flex-col">
          <a class="text-xs text-white opacity-60" href="https://www.pawcapsu.ml/">Pawcapsu</a>
          <a class="text-xs text-white opacity-60" href="/leggydog">Leggydog Bot</a>
          <a class="text-xs text-white opacity-60" href="https://www.ctrlpaint.ru">CtrlPaint.ru</a>
          <a class="text-xs text-white opacity-60" href="https://www.odzi.dog/">Dog Services</a>
        </div>
      </div>

      <!-- Other -->
      <div class="mx-8">
        <h1 class="text-md text-white font-medium opacity-80">Social links</h1>

        <div class="mt-2 flex flex-col">
          <a class="text-xs text-white opacity-60" href="/">Our Twitter</a>
          <a class="text-xs text-white opacity-60" href="/">Our Discord</a>
          <a class="text-xs text-white opacity-60" href="/">Our Github</a>
        </div>
      </div>
    </div>
  </div>
{ :else }
  <main class="absolute w-full h-screen bg-gray-900 flex justify-center items-center">
  </main>
{ /if }