<script lang="typescript">
  // Importing theme wrapper
  import theme from '@pawcapsu/design/Wrapper'

  // Importing properties-related data
  // -sizes
  import sizes from './properties/Sizes';
  import type { EHeadingSize } from './properties/Sizes';

  // -colors
  import colors from '../properties/Colors';
  import type { ETextColor } from '../properties/Colors';

  // Exporting variables
  export let size: EHeadingSize = 'base';
  export let color: ETextColor = 'white';
  export let classes: String = '';
</script>

<h1 class="{
  // Size-related
  theme.$(`heading.${size}`,
    sizes[size])} {

  // Colors-related
  theme.$(`text.color.${color}`,
    colors[color])}
    
  {classes}">
  <slot />
</h1>