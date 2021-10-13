<script lang="typescript">
  // Importing theme wrapper
  import theme from '../Wrapper';

  // Importing properties-related information
  // -types
  import types from './properties/Types';
  import type { EButtonType } from './properties/Types';

  // -sizes
  import sizes from './properties/Sizes';
  import type { EButtonSize } from './properties/Sizes';

  // Exporting values
  export let type: EButtonType = 'solid';
  export let size: EButtonSize = 'auto';
</script>

<button on:click class="{
  // Default values
  theme.$('button.default', 
    [ 'rounded-md', 'py-2', 'px-4', 'flex', 'items-center', 'justify-center', 'mx-2' ])} {
  
  // Type-related classes
  theme.$(`button.type.${type}`, 
    types[type])} {
  // Size-related classes
  theme.$(`button.size.${size}`,
    sizes[size])}">
  
  <slot />
</button>