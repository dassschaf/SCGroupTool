<script lang="ts">
    import { getJoinedSalvageRuns } from "$lib/database/salvage.remote.ts";
    import User from "$lib/components/User.svelte"
    import Button from "$lib/components/Button.svelte"
    import Icon from "$lib/components/Icon.svelte";
    import {faPlusCircle, faRocket} from "@fortawesome/free-solid-svg-icons";

    let { data } = $props();
    let salvageRuns = $derived(getJoinedSalvageRuns().current);
</script>

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
        <tr>
            <td class="font-semibold">{sr.id}</td>
            <td><User username={sr.owner_name} image={sr.owner_image} /></td>
            <td>{sr.created_at.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
            <td>{sr.member_count}</td>
            <td>{Intl.NumberFormat().format(sr.profit)} aUEC</td>
            <td><Button class="w-full" href="/salvage/{sr.id}">Continue <Icon class="h-8 w-8 ml-3" icon={faRocket}/></Button></td>
        </tr>
    {/each}
    </tbody>
</table>

<!-- spacer -->
<div class="h-1/2"></div>

<!-- add button to open right side sidebar -->
<Button class="p-2 rounded float-right"><Icon class="w-4 h-4" icon={faPlusCircle}/></Button>