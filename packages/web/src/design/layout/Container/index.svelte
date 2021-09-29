<script lang="typescript">
  // Importing theme wrapper
  import theme from '@pawcapsu/design/Wrapper';

  // Importing properties-related data
  // -types
  import types from './properties/Types';
  import type { EContainerType } from './properties/Types';

  // -sizes
  import sizes from './properties/Sizes';
  import type { EContainerSize } from './properties/Sizes';

  // -flexes
  import flexes from './properties/Flexes';
  import type { EContainerFlex } from './properties/Flexes';

  // -background
  import backgrounds from './properties/Backgrounds';
  import type { EContainerBackground } from './properties/Backgrounds';

  // Export variables
  export let type: EContainerType = 'base';
  export let flex: EContainerFlex = 'none';
  export let size: EContainerSize = 'auto';
  export let background: EContainerBackground = 'dark';
  export let classes: String = '';
</script>

<section class="{
  // Type-related
  theme.$(`container.${type}`,
    types[type])} {
  
  // Flexes-related
  theme.$(`container.flex.${flex}`,
    flexes[flex])} {
  
  // Background-related
  theme.$(`container.background.${background}`,
    backgrounds[background])} {
  
  // Size-related
  theme.$(`container.size.${size}`,
    sizes[size])}
  
  {classes}
  relative">
  <slot/>
</section>