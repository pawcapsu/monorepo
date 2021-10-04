<script lang="typescript">
  // Importing theme wrapper
  import theme from 'src/design/Wrapper';

  // Importing properties-related data
  // -sizes
  import sizes from './properties/Sizes';
  import type { EParagraphSize } from './properties/Sizes';

  // -colors
  import colors from '../properties/Colors';
  import type { ETextColor } from '../properties/Colors';

  // Exporting variables
  export let size: EParagraphSize = 'base';
  export let color: ETextColor = 'white';
  export let classes: String = '';
</script>

<p class="{
  // Size-related
  theme.$(`paragraph.${size}`,
    sizes[size])} {
  
  // Colors-related
  theme.$(`text.color.${color}`,
    colors[color])}
    
  {classes}">
  <slot />
</p>