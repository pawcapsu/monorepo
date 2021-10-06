<script lang="typescript">
  // Importing types
  import type { IExploreBadge } from '@app/shared';
  
  // Importing components
  import {
    Container,
  } from 'src/design';
  import Icon from '../Icon.svelte';

  export let badges: IExploreBadge[] = [];
  export let selectedBadges: IExploreBadge[] = [];
</script>

<Container background="light-dark" flex="between">
  <Container background="light-dark" flex="flex">
    { #if badges }
      { #each badges as badge }
        <div on:click={() => {
          if (selectedBadges.includes(badge)) {
            selectedBadges.splice(selectedBadges.indexOf(badge), 1);
            selectedBadges = selectedBadges;
          } else {
            selectedBadges = [...selectedBadges, badge];
          };
        }} class="cursor-pointer mx-1 px-2 py-1 rounded-full flex items-center justify-center { selectedBadges.includes(badge) ? badge.color ?? 'bg-indigo-500' : 'bg-gray-500' }">
          <p class="text-sm text-white font-medium">{ badge.title }</p>
        
          <!-- If selected -->
          { #if selectedBadges.includes(badge) }
            <Icon name="x" attrs={{ class: "w-5 h-5 text-white ml-2", "stroke-width": "3" }} />
          { /if }
        </div>
      { /each }
    { /if }
  </Container>
  
  <div class="mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-900 bg-opacity-70">
    <Icon name="more-horizontal" attrs={{ class: "w-4 h-4 text-white mr-2", "stroke-width": "3" }} />

    <p class="text-md text-white font-medium">Больше</p>
  </div>
</Container>