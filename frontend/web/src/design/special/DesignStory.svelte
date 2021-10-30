<script lang="typescript">
  import Icon from 'src/components/Icon.svelte';
  import type { SvelteComponent } from "svelte";

  export let components: {
    name: string;
    description: string;
    component: any;
    properties: { id: string, description: string, values: Object, color: string }[];
    attributes: Object;
  }[] = [];
  export let placeholderText = "component";
  export let componentSpace: "1/3" | "full" = "1/3";
</script>

<!-- Components -->
<div class="w-full relative">
  { #each components as component }

    <!-- Hero -->
    <div class="my-6 w-1/3 mx-3">
      <h1 class="text-3xl font-medium">{ component.name }</h1>
      <p class="text-md text-black opacity-70">{ component.description }</p>
    </div>

    <!-- Variations -->
    { #each component.properties as property }
      <div class="w-full mb-4">
        <!-- Text -->
        <div class="m-3">
          <h1 class="text-xl text-black">{ property.id }</h1>
          <p class="text-sm text-black opacity-70">{ property.description }</p>
        </div>

        <!-- Values -->
        <div class="mt-4 w-full flex flex-wrap items-stretch relative">
          { #each Object.keys(property.values) as value }
            <div class="w-{componentSpace} { property.color == 'white' ? 'bg-gray-200' : 'bg-gray-800' } rounded-xl m-3 flex items-center justify-center py-8 pt-12 relative">
              <!-- Mini-Header -->
              <div class="absolute inset-x-0 top-0 w-full px-4 flex justify-end place-items-center py-1.5">
                <div class="px-3 py-1.5 flex items-center rounded-xl { property.color == 'white' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black' }">
                  <!-- Change color button -->
                  <button on:click={() => {
                    property.color == 'white' ?
                      property.color = 'dark' :
                      property.color = 'white';
                  }} class="mr-1.5">
                    { #if property.color == 'white' }
                      <Icon name="moon" attrs={{ class: 'w-4 h-4' }} />
                    { :else }
                      <Icon name="sun" attrs={{ class: 'w-4 h-4' }} />
                    { /if }
                  </button>

                  <p class="text-sm">{ value }</p>
                </div>
              </div>

              <svelte:component this={ component.component } {...{ [property.id]: value }} {...component.attributes}>
                { value } { placeholderText }
              </svelte:component>
            </div>
          { /each }
        </div>
      </div>
    { /each }
  { /each }
</div>