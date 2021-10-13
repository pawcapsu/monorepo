<script>
  // Importing modules
  import { afterUpdate, createEventDispatcher } from "svelte";
  import moment from "moment";

  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  // Importing components
  import Icon from "./Icon.svelte";
  // import Spinner from "../../Spinner.svelte";

  // Variables

  // @variable hover
  // - Hover state of this card
  let hover = false;

  // @variable profileIconHover
  let profileIconHover = false;

  // @variable sizes
  // - Card sizes + text sizes
  let sizes = {
    width: "1/4",

    imageHeight: "2/3",
    textHeight: "1/3",

    titleSize: "md",
    textSize: "xs"
  };

  // Function, that'll redirect
  // client to this profile account
  function openProfile() {
    // goto(`/profile/retrieve?provider=${ entry.provider || "internal" }&identifier=${entry.author.nickname}`);
  };

  // Function, that'll open this post for
  // this user
  function openPost() {
    // Firstly we need to send event to our browser component
    // (or whatever component we have as parent component)
    dispatch("open", entry);

    // And now we need to change our current url
    // url.searchParams.set('foo', 'bar');
    // window.history.pushState({}, "", `/post/${entry.id}`);
  };

  // After Update
  // - Updating card sizes
  afterUpdate(() => {
    // Updating sizes
    switch (size) {
      case "sm":
        sizes = {
          width: "1/4",

          imageHeight: hideContent ? "full" : "2/3",
          textHeight: hideContent ? "none" : "1/3",
          
          titleSize: "md",
          textSize: "xs"
        };
        break;
    
      case "md":
        sizes = {
          width: "1/3",

          imageHeight: hideContent ? "full" : "4/5",
          textHeight: hideContent ? "none" : "1/5",

          titleSize: "md",
          textSize: "xs"
        };
        break;
    
      case "xl":
        sizes = {
          width: "1/2",

          imageHeight: hideContent ? "full" : "5/6",
          textHeight: hideContent ? "none" : "1/6",

          titleSize: "xl",
          textSize: "sm"
        };
        break;
    };
  });

  // Exporting variables

  // @export entry
  // - Post information
  export let entry = {};

  // @export cardSize
  // - Card size. Default: 1/4
  // values: 1/4, 1/3, 1/2
  export let size = "1/4";

  // @export hideStats
  // - Hide or show statistics
  // text?
  export let hideStats = false;

  // @export hideContent
  // - Do we need to hide
  // content section (artwork name, statistics)
  export let hideContent = false;
</script>

<!-- ContentCard layout -->
<div in:fade class="w-full md:w-{ sizes.width } relative p-2">
  <div style="padding-top: 120%" class="w-full relative">
    <div on:click={() => openPost()} on:mouseenter={() => hover = true} on:mouseleave={() => hover = false} class="absolute cursor-pointer inset-0 w-full h-full bg-light-dark rounded-lg flex flex-col">
      <!-- Tooltip -->
      { #if hover }
        <div style="z-index: 2;" class="absolute inset-0 w-full top-0 p-2 flex justify-start">
          <div transition:fade class="transition duration-200 ease-in-out h-8 bg-dark px-3 opacity-40 rounded-full flex items-center">
            <p class="text-xs text-white">Нажмите, что бы открыть</p>
          </div>
        </div>
      { /if }
      
      { #if entry.source.nsfw }
        <!-- Image itself -->
        <div style="z-index: 0; overflow: hidden;" class="rounded-t-md h-{ sizes.imageHeight } w-full relative">
          <!-- Image -->
          <div style="z-index: 1; filter: blur(5px); background: url('{ entry.source.image }');" class="absolute inset-0"></div>

          <div style="z-index: 2;" class="absolute inset-0 w-full h-full bg-dark opacity-95 rounded-t-md flex justify-center items-center">
            <!-- Badge -->
            <div class="px-3 py-1 bg-light-dark rounded-full text-white text-sm">
              NSFW
            </div>
          </div>
        </div>
      { :else }
        <!-- Loader -->
        <div style="z-index: 1;" class="rounded-t-md h-{ sizes.imageHeight } w-full absolute flex justify-center items-center">
          <!-- Spinner -->
          <!-- <Spinner /> -->
        </div>

        <!-- Image itself -->
        <div style="z-index: 2;" class="rounded-t-md h-{ sizes.imageHeight } w-full relative">
          <img style="background-size: cover; background-position: center; background-image: url({ entry.source.image })" src="https://www.echr.com.ua/wp-content/uploads/2018/05/Empty.png" class="w-full h-full" alt="{ entry.source.title } by { entry.author.displayName }">
          <div class="absolute inset-0 w-full h-full bg-dark opacity-30 rounded-t-md"></div>
        </div>
      { /if }

      <!-- Avatar + Badge -->
      <div on:mouseenter={() => profileIconHover = true} on:mouseleave={() => profileIconHover = false} style="z-index: 3;" class="absolute top-0 right-0 p-2 opacity-80">
        <div class="transition duration-200 ease-in-out bg-dark { profileIconHover ? "pl-3" : "" } rounded-full flex items-center">
          { #if profileIconHover }
            <!-- User Name -->
            <div on:click={() => openProfile()} in:fade class="mr-3 flex items-center text-white cursor-pointer">
              <h1 class="text-md font-medium border-b border-dotted border-white">{ entry.author.displayName }</h1>
              
              <!-- Icon -->
              <Icon name="link" attrs={{ class: "w-3 h-3 ml-1" }} />
            </div>
          { /if }
          
          <!-- Avatar -->
          <div style="background-image: url('{ entry.author.avatar }'); background-size: cover; background-position: center;" class="w-8 h-8 rounded-full"></div>
        </div>
      </div>

      { #if !hideContent }
        <!-- Text -->
        <div class="h-{ sizes.textHeight } w-full p-2">
          <!-- Image Name -->
          <h2 class="text-{ sizes.titleSize } text-white font-bold my-2">{ entry.source.title }</h2>

          { #if !hideStats }
            <!-- Statistics -->
            <div class="flex items-center opacity-50 text-{ sizes.textSize }">
              <!-- Post Views -->
              <p class="text-white">{ entry.source.views } просмотров</p>

              <!-- Dot -->
              <div class="w-1 h-1 mx-2 bg-white rounded-full"></div>
              
              <!-- Post Time -->
              <p class="text-white">{ moment(entry.source.published).fromNow() }</p>
            </div>
          { /if }
        </div>
      { /if }
    </div>
  </div>
</div>