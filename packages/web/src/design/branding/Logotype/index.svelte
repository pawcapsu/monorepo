<script lang="typescript">
  // Importing theme wrapper
  import theme from 'src/design/Wrapper';

  // Importing properties-related data
  import type { ELogotypeType } from './properties/Types';

  // Exporting variables
  export let type: ELogotypeType = 'icon';
</script>

{ #if type === 'full' }
  <div class="flex items-center">
    <img class="w-10 h-10" src="https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg" alt="">
 
    <p class="ml-2 text-3xl font-bold text-white">pawcapsu</p>
  </div>
{ :else if type === 'icon' }
  <img class="w-10 h-10" src="https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg" alt="">
{ /if }