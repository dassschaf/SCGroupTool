<script lang="ts">
    import { getJoinedSalvageRuns, createSalvageRun } from "$lib/database/salvage.remote.ts";
    import User from "$lib/components/User.svelte"
    import Button from "$lib/components/Button.svelte"
    import Icon from "$lib/components/Icon.svelte";
    import {faPlus, faRocket} from "@fortawesome/free-solid-svg-icons";
    import {goto} from "$app/navigation";

    let { data } = $props();
    let salvageRuns = $derived(getJoinedSalvageRuns().current);
</script>

<div class="p-4">
    <table class={[
    "w-full divide-y divide-gray-200 table-auto",
    "[&_th]:px-2 [&_th]:text-center [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
    "[&_thead_tr]:h-10",
    "[&_tbody]:divide-y [&_tbody]:divide-gray-200",
    "[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-50",
    "[&_td]:px-2 [&_td]:text-sm [&_td]:whitespace-nowrap [&_td]:text-center"
    ]}>

        <thead>
        <tr>
            <th>#</th>
            <th>Owner</th>
            <th>Start date</th>
            <th>Members</th>
            <th>Current profits</th>
            <th><!-- empty => select button --></th>
        </tr>
        </thead>

        <tbody>
        {#each salvageRuns as sr}
            <tr class={[
            sr.is_finished ? "bg-[repeating-linear-gradient(45deg,var(--color-secondary-200)_0,var(--color-secondary-200)_2px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed" : ""
         ]}>
                <td class="font-semibold">{sr.id}</td>
                <td><User username={sr.owner_name} image={sr.owner_image} /></td>
                <td>{sr.created_at.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
                <td>{sr.member_count}</td>
                <td>{Intl.NumberFormat().format(sr.profit ? sr.profit : 0)} aUEC</td>
                <td>
                    {#if sr.is_finished}
                        <Button class="w-full" disabled>Continue <Icon class="h-8 w-8 ml-3" icon={faRocket}/></Button>
                    {:else}
                        <Button class="w-full"
                                href="/salvage/{sr.id}">Continue <Icon class="h-8 w-8 ml-3" icon={faRocket}/></Button>
                    {/if}
                </td>
            </tr>
        {:else}
            <tr>
                <td colspan="6">
                    You're not part of any salvage runs (yet).
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

    <!-- add button to open right side sidebar -->
    <div class="h-8"></div>
    <div>
        <Button
                data-sveltekit-preload-code="false"
                data-sveltekit-preload-data="false"
                class="p-2 rounded-full float-right gap-3 max-h-9"
                onclick={
                async () => {
                    let id = await createSalvageRun();
                    await goto(`/salvage/${id}`);
                }
            }
        >
            <Icon class="w-8 h-8" icon={faPlus}/>
            Start new salvage run
        </Button>
    </div>
</div>

