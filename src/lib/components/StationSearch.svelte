<script lang="ts">
import {getStations} from "$lib/database/universe.remote";
import Input from "$lib/components/Input.svelte";
import Button from "$lib/components/Button.svelte";

let searchValue = $state("");
let {
    id = $bindable(-1)
} = $props();
</script>

<div class="flex flex-col p-2">
    <small class="p-2">Station</small>
    <Input
            id="clStationSearch"
            bind:value={searchValue}
            autocomplete="off"
            autofocus
            class="w-full mb-2"
            placeholder="Search stations..."
            type="search"
    />
    {#if searchValue.length > 2}
        {#each (await getStations()).filter((st) =>
            st.name.toLowerCase().includes(searchValue.toLowerCase())
        ) as st (st.id)}
            <Button class="m-2 min-h-fit min-w-fit p-2" onclick={() => {
						id = st.id;
						searchValue = ""; // reset search
					}}>
                {st.name}
                <br />
                <small>{st.system}</small>
            </Button>
        {/each}
    {/if}
</div>