<script lang="ts">
    import type { ClassValue } from 'svelte/elements';
    let { username, image, class: classValue } = $props();
</script>


<div class={["flex justify-center items-center text-center gap-3 py-3 text-sm", classValue ]}>
    <img alt="{username}'s profile picture" class="h-9 w-9 rounded-full bg-white" src="{image}" />
    {username}
</div>