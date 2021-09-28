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
  </main>
{ /if }