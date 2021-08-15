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
{ :else }
  <main class="absolute w-full h-screen bg-gray-900 flex justify-center items-center">
    <img class="w-12 h-12" src="https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg" alt="">
  </main>
{ /if }