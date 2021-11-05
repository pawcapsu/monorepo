<script lang="typescript">
  // Importing modules
  import { UserStore } from '$stores/user';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import Icon from 'src/components/Icon.svelte';

  import {
    Container,
    Logotype,
    Sidebar,
  } from 'src/design';

  onMount(() => {
    if ($UserStore.user == null) {
      goto('/login/link');
    } else {
      loading = false;
    };
  });

  // Variables
  let loading: boolean = true;
</script>

{ #if loading }
  <Container type="full" flex="centered">
    <Logotype type="icon" />
  </Container>
{ :else }
  <!-- Container -->
  <Container flex="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Content -->
    <section class="w-full h-full relative">
      <slot />
    </section>

  </Container>
{ /if }