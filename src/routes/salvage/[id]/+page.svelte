<script lang="ts">
	import type { PageProps } from "./$types";
	import User from "$lib/components/User.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import {faCheck, faPlus, faSnowflake, faXmark} from "@fortawesome/free-solid-svg-icons";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import { searchUserByName } from "$lib/database/user.remote.ts";
	import FormSidebar from "$lib/components/FormSidebar.svelte";

	let { data }: PageProps = $props();

	// sidebar states
	let addMemberSidebarOpen = $state(false);
	let anySidebarOpen = $derived(addMemberSidebarOpen);

	// search value states
	let userSearchValue = $state("");

	// eslint-disable-next-line svelte/no-inspect
	$inspect(data);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === "Escape") addMemberSidebarOpen = false;
	}}
/>

<!-- sidebar backdrop -->
<div
	class={[
		"fixed inset-0 z-50 bg-black/50 transition-opacity",
		anySidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
	]}
	onclick={() => {
		addMemberSidebarOpen = false;
	}}
></div>

<!-- add member sidebar -->
<FormSidebar bind:sidebarFlag={addMemberSidebarOpen} formHeading="Add Members">
	<!-- user search bar -->
	<Input
		bind:value={userSearchValue}
		autocomplete="off"
		autofocus
		class="w-full"
		placeholder="Search users..."
		type="search"
	/>

	<!-- spacer -->
	<div class="h-8"></div>

	<!-- user list -->
	<div class="flex justify-center align-middle">
		{#each searchUserByName("%" + userSearchValue + "%").current as user (user.id)}
			<Button class="h-12 min-w-fit p-4">
				<User class="flex-1" username={user.name} image={user.image} />
			</Button>
		{:else}
			<p class="flex-auto text-center">Enter at least three characters.</p>
		{/each}
	</div>
</FormSidebar>

<div class="m-4 flex flex-row rounded-md bg-gray-200 p-4">
	<!-- owner & financial info -->
	<div class="flex flex-4 flex-col">
		<p class="text-center font-semibold">run #{data.id} &mdash; Overview</p>
		<table
			class={[
				"w-full table-auto divide-y divide-gray-200",
				"[&_th]:px-2 [&_th]:text-center [&_th]:text-sm [&_th]:font-semibold [&_th]:tracking-wide  [&_th]:uppercase",
				"[&_thead_tr]:h-10",
				"[&_tbody]:divide-y [&_tbody]:divide-gray-200",
				"[&_tbody_tr]:h-10",
				"[&_td]:px-2 [&_td]:text-sm [&_td]:whitespace-nowrap"
			]}
		>
			<thead>
				<tr>
					<th colspan={(data.memberList.length > 1) ? 3 : 6} class="text-primary-600"
						>Profit: {Intl.NumberFormat().format(data.financialOverview.profit)} aUEC</th
					>
					<th colspan="3" class="text-primary-600"
						>{#if data.memberList.length > 1}
							Payout: {Intl.NumberFormat().format(
								(data.financialOverview.profit / data.memberList.length) * 0.995
							)} aUEC
						{/if}</th
					>
				</tr>
				<tr>
					<th colspan="3" class="text-green-600"
						>Revenue: {Intl.NumberFormat().format(
							data.financialOverview.sales_revenue.reduce((sum, sale) => (sum += sale.revenue), 0)
						)} aUEC</th
					>
					<th colspan="3" class="text-secondary-600"
						>Expenses: {Intl.NumberFormat().format(
							data.financialOverview.claims.reduce((sum, claim) => (sum += claim.fees), 0) +
								data.financialOverview.event_fees.reduce((sum, event) => (sum += event.fees), 0)
						)} aUEC</th
					>
				</tr>
			</thead>
			<tbody>
				{#each data.financialOverviewRows as r}
					<tr>
						{#if r.sales}
							<td class="text-right">{r.sales.cargo_name}</td>
							<td class="text-center"
								>{r.sales.station_name}<br>
								<small>{r.sales.system_name}</small></td
							>
							<td class="text-left">{Intl.NumberFormat().format(r.sales.revenue)} aUEC</td>
						{:else}
							<td colspan="3"></td>
						{/if}
						{#if r.expenses}
							<td class="text-right">{r.expenses.type}</td>
							<td class="text-center"
								>{r.expenses.comment}<br>
								{#if r.expenses.comment_sub !== ""}<small>{r.expenses.comment_sub}</small>{/if}</td
							>
							<td class="text-left">{Intl.NumberFormat().format(r.expenses.fees)} aUEC</td>
						{:else}
							<td colspan="3"></td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="w-8" />

	<!-- member list -->
	<div class="flex flex-1 flex-col text-center">
		<p class="text-center font-semibold">Member list</p>
		<div class="h-8" />
		{#each data.memberList as member}
			<div
				class={[
					"flex flex-row justify-center align-middle",
					member.was_paid
						? "bg-[repeating-linear-gradient(45deg,var(--color-green-400)_0,var(--color-green-400)_2px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed"
						: ""
				]}
			>
				<User class="flex-1" username={member.name} image={member.image} />
				{#if member.id === data.owner.id}
					<div class="flex flex-1 items-center justify-center gap-3 py-3 text-center">
						<small>(owner)</small>
					</div>
				{:else}
					<div class="flex flex-1 items-center justify-center gap-3 py-3 text-center">
						{#if data.owner.id === data.user.id}
							<!-- TODO: add onclick handlers (mark paid, remove from run) -->
							<Button class="h-6 min-w-fit p-2"><Icon class="text-secondary-600 h-4 w-4" icon={faCheck}/></Button>
							<Button class="h-6 min-w-fit p-2"><Icon class="text-secondary-600 h-4 w-4" icon={faXmark}/></Button>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			No members.
		{/each}
		<div class="h-8"></div>
		<div class="flex flex-row-reverse">
			<Button
				class="float-right h-10 min-w-fit p-2"
				onclick={() => {
					addMemberSidebarOpen = true;
				}}
			>
				Add member <Icon icon={faPlus} class="h-8 w-8" />
			</Button>
		</div>
	</div>
</div>

<div class="h-8"></div>

<!-- cargo overview -->
<div></div>

<!-- refinery jobs -->
<div></div>

<!-- sales -->
<div></div>
