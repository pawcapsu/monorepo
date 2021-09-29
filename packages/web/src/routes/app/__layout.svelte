<script lang="typescript">
  // Importing modules
  import { UserStore } from '$stores/user';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import {
    Container,
    Logotype,
  } from '@pawcapsu/design';

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
  <slot />
{ /if }