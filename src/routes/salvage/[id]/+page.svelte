<script lang="ts">
    import type { PageProps } from "./$types";
    import User from "$lib/components/User.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import {faPlus, faSnowflake, faXmark} from "@fortawesome/free-solid-svg-icons";
    import Button from "$lib/components/Button.svelte";

    let { data }: PageProps = $props();

    let formSidebarOpen = $state(false);

    $inspect(data);
</script>

<!-- sidebar backdrop -->
<div
        class={[
			"fixed inset-0 z-50 bg-black/50 transition-opacity",
			formSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
		]}
        onclick="{() => (formSidebarOpen = false)}"
></div>

<!-- sidebar -->
<aside
        class={[
			"fixed inset-y-0 right-0 z-50 w-1/2 text-white transition-transform main-background",
			formSidebarOpen ? "translate-x-0" : "translate-x-full"
		]}>

    <div class="flex h-full flex-col px-4">
        <div class="flex h-16 items-center gap-3">
            <button
                    aria-label="Close sidebar"
                    class="rounded-md p-2"
                    onclick={() => (formSidebarOpen = false)}
            >
                <Icon class="h-6 w-6" icon={faXmark} />
            </button>
        </div>

        <nav class="flex-1 py-4">
            <h1>Add member</h1>

            <ul class="space-y-1">

            </ul>
        </nav>
    </div>
</aside>

<div class="flex flex-row m-4 p-4 bg-gray-200 rounded-md">
    <!-- owner & financial info -->
    <div class="flex-5 flex flex-col">
        <p class="text-center font-semibold">run #{data.id} &mdash; Overview</p>
        <div class="flex justify-center items-start flex-row [&_table]:m-4 [&_table]:w-full">
            <!-- 1 column table: revenue -->
            <table>
                <thead>
                    <tr>
                        <th class="text-green-600">Revenue</th>
                        <th class="text-green-600">{ Intl.NumberFormat().format(data.financialOverview.sales_revenue.reduce((sum, sale) => sum += sale.revenue, 0))} aUEC</th>
                    </tr>
                </thead>
                <tbody>
                {#each data.financialOverview.sales_revenue as r}
                    <tr>
                        <td>{r.cargo_name}</td>
                        <td class="flex flex-col"><span>{r.station_name}</span><small>{r.system_name}</small></td>
                        <td class="text-right">{ Intl.NumberFormat().format(r.revenue) } aUEC</td>
                    </tr>
                {/each}
                </tbody>
            </table>

            <!-- 1 column table: expenses -->
            <table>
                <thead>
                <tr>
                    <th class="text-secondary-600">Expenses</th>
                    <th class="text-secondary-600">{ Intl.NumberFormat().format(data.financialOverview.claims.reduce((sum, claim) => sum += claim.fees, 0) + data.financialOverview.event_fees.reduce((sum, event) => sum += event.fees, 0)) } aUEC</th>
                </tr>
                </thead>
                <tbody>
                {#each data.financialOverview.claims as claim}
                <tr>
                    <td>Salvage claim</td>
                    <td>{ (claim.comment === "--") ? "" : claim.comment }</td>
                    <td class="text-right">{ Intl.NumberFormat().format(claim.fees) } aUEC</td>
                </tr>
                {/each}
                {#each data.financialOverview.event_fees as event}
                    <tr>
                        <td>{ event.type === "REFINE" ? "Refinery fees" : "Sales fees" }</td>
                        <td class="flex flex-col"><span>{event.station_name}</span><small>{event.system_name}</small></td>
                        <td class="text-right">{ Intl.NumberFormat().format(event.fees) } aUEC</td>
                    </tr>
                {/each}
                </tbody>
            </table>

            <!-- 1 column table: profit -->
            <table>
                <thead>
                <tr>
                    <th colspan="2" class="text-primary-600">Profit</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="text-right">{ Intl.NumberFormat().format(data.financialOverview.profit) } aUEC</td>
                    <td class="text-left"><small class="pl-2">total</small></td>
                </tr>
                <tr>
                    <td class="text-right">{ Intl.NumberFormat().format(data.financialOverview.profit / data.memberList.length) } aUEC</td>
                    <td class="text-left"><small class="pl-2">pay per member</small></td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>

    <div class="w-8"/>

    <!-- member list -->
    <div class="flex-1 flex flex-col text-center">
        <p class="text-center font-semibold">Member list</p>
        <div class="h-8"/>
        {#if data.memberList.length > 0}
        {#each data.memberList as member}
        <div class={[
            "flex flex-row align-middle justify-center",
            member.was_paid ? "bg-[repeating-linear-gradient(45deg,var(--color-green-400)_0,var(--color-green-400)_2px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed" : ""
            ]}>
            <User class="flex-1" username={member.name} image={member.image}/>
            {#if member.id === data.owner.id}
            <div class="flex-1 flex justify-center items-center text-center gap-3 py-3">
                <small>(owner)</small>
            </div>
            {:else}
            <div class="flex-1 flex justify-center items-center text-center gap-3 py-3">
                {#if data.owner.id === data.user.id}
                    <Button class="min-w-fit h-6 p-2">mark paid</Button>
                {/if}
            </div>
            {/if}

        </div>
        {/each}
        {:else}
            No members.
        {/if}
        <div class="h-8"/>
        <div class="flex flex-row-reverse">
            <Button
                class="min-w-fit h-10 float-right p-2"
                onclick={() => { formSidebarOpen = true; }}
            >
                Add member <Icon icon={faPlus} class="w-8 h-8"/>
            </Button>
        </div>

    </div>
</div>

<div class="h-8"/>

<!-- cargo overview -->
<div>

</div>

<!-- refinery jobs -->
<div>

</div>

<!-- sales -->
<div>

</div>