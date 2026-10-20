<script lang="ts">
    import type { ClassValue } from 'svelte/elements';
    import {getUserInfo} from "$lib/database/user.remote";
    let { username, image, id, class: classValue } = $props();
</script>

{#if username !== undefined && image !== undefined}
    <div class={["flex justify-center items-center text-center gap-3 py-3 text-sm", classValue ]}>
        <img alt="{username}'s profile picture" class="h-9 w-9 rounded-full bg-white" src="{image}" />
        {username}
    </div>
{:else if id !== undefined}
    <div class={["flex justify-center items-center text-center gap-3 py-3 text-sm", classValue ]}>
        <img alt="{(await getUserInfo(id)).name}'s profile picture" class="h-9 w-9 rounded-full bg-white" src={(await getUserInfo(id)).image} />
        {(await getUserInfo(id)).name}
    </div>
{:else}
    <div class={["flex justify-center items-center text-center gap-3 py-3 text-sm", classValue ]}>
        <img alt="Placeholder profile picture" class="h-9 w-9 rounded-full bg-white" src="https://placehold.co/128x128" />
        <i>Unknown</i>
    </div>
{/if}