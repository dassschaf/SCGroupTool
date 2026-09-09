<script lang="ts">
	import type { PageProps } from "./$types";
	import User from "$lib/components/User.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import {
		faCheck,
		faIndustry,
		faMoneyBillWave,
		faPlus,
		faXmark
	} from "@fortawesome/free-solid-svg-icons";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import { searchUserByName } from "$lib/database/user.remote.ts";
	import FormSidebar from "$lib/components/FormSidebar.svelte";
	import {
		addUserToSalvageRun,
		getSalvageRunFinancialOverview,
		getSalvageRunMemberList,
		getSalvageRunOwner
	} from "$lib/database/salvage.remote.ts";
	import {
		getCargoLotsBySRID,
		getRefineryEventsBySRID,
		getSalesEventsBySRID
	} from "$lib/database/cargo.remote.ts";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import {getCargoTypes, getStations} from "$lib/database/universe.remote.ts";

	// properties
	let { data }: PageProps = $props();

	// sidebar states
	let addMemberSidebarOpen = $state(false);
	let addCargoLotSidebarOpen = $state(false);
	let addRefineryJobSidebarOpen = $state(false);
	let addCargoSaleSidebarOpen = $state(false);
	let anySidebarOpen = $derived(
		addMemberSidebarOpen ||
			addCargoLotSidebarOpen ||
			addRefineryJobSidebarOpen ||
			addCargoSaleSidebarOpen
	);

	// form input values
	let userSearchValue = $state("");
	let clTypeSearchValue = $state("");
	let clStationSearchValue = $state("");
	let clAmountValue = $state("")

	// database query results
	let memberList = await getSalvageRunMemberList(data.id);
	let owner = await getSalvageRunOwner(data.id);
	let financialOverview = await getSalvageRunFinancialOverview(data.id);
	let cargoLots = await getCargoLotsBySRID(data.id);
	let refineryJobs = await getRefineryEventsBySRID(data.id);
	let cargoSales = await getSalesEventsBySRID(data.id);
	let stations = await getStations();
	let cargoTypes = await getCargoTypes();

	$inspect(stations.filter(st => { st.name.includes(clStationSearchValue) }));
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === "Escape") {
			addMemberSidebarOpen = false;
			addCargoLotSidebarOpen = false;
			addRefineryJobSidebarOpen = false;
			addCargoSaleSidebarOpen = false;
		}
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
		addCargoLotSidebarOpen = false;
		addRefineryJobSidebarOpen = false;
		addCargoSaleSidebarOpen = false;
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
			<Button
				class="h-12 min-w-fit p-4"
				onclick={async () => {
					await addUserToSalvageRun({ salvage_run_id: data.id, user_id: user.id });
					await memberList.refresh();
				}}
			>
				<User class="flex-1" username={user.name} image={user.image} />
			</Button>
		{:else}
			<p class="flex-auto text-center">Enter at least three characters.</p>
		{/each}
	</div>
</FormSidebar>

<!-- add cargo lot sidebar -->
<FormSidebar bind:sidebarFlag={addCargoLotSidebarOpen} formHeading="Add a cargo item">
	<div class="flex flex-row">
		<div class="flex p-2 flex-col">
			<small class="p-2">Cargo type</small>
			<Input bind:value={clTypeSearchValue}
				   autocomplete="off"
				   autofocus
				   class="w-full"
				   placeholder="Search cargo types..."
				   type="search"
			/>

		</div>

		<div class="flex p-2 flex-col">
			<small class="p-2">Station</small>
			<Input bind:value={clStationSearchValue}
				   autocomplete="off"
				   autofocus
				   class="w-full"
				   placeholder="Search stations..."
				   type="search"
			/>
			{#if clStationSearchValue.length > 2}
			{#each stations.filter(st => { st.name.includes(clStationSearchValue) }) as st (st.id)}
			<Button
					class="m-4 h-6 min-w-fit p-2"
					onclick={() => {

					}}
			>
				{st.name}
				<br>
				<small>{st.system}</small>
			</Button>
			{/each}
			{/if}

		</div>

		<div class="flex p-2 flex-col">
			<small class="p-2">Amount</small>
			<Input bind:value={clAmountValue}
				   autocomplete="off"
				   autofocus
				   class="w-full"
				   placeholder="Search cargo types..."
				   type="number"
			/>
		</div>
	</div>


</FormSidebar>

<!-- add refinery job sidebar -->
<FormSidebar
	bind:sidebarFlag={addRefineryJobSidebarOpen}
	formHeading="Add refinery job"
></FormSidebar>

<!-- add cargo sale sidebar -->
<FormSidebar bind:sidebarFlag={addCargoSaleSidebarOpen} formHeading="Add cargo sale"></FormSidebar>

<!-- headline -->
<PageHeading>
	run #{data.id} &mdash; Overview
</PageHeading>

<div class="flex flex-row">
	<!-- owner & financial info -->
	<div class="m-4 flex-3 flex-col rounded-md bg-gray-200 p-4">
		<p class="text-center font-semibold">Financial overview</p>
		<div class="flex flex-row">
			<div class="flex-1">
				<table
					class={[
						"w-full divide-y divide-gray-200",
						"[&_th]:px-2 [&_th]:text-center [&_th]:text-sm [&_th]:font-semibold [&_th]:tracking-wide [&_th]:uppercase",
						"[&_thead_tr]:h-10",
						"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
						"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
						"[&_td]:px-2 [&_td]:text-sm [&_td]:whitespace-nowrap"
					]}
				>
					<thead>
						<tr>
							<th colspan="3" class="text-green-600">
								Revenue: {Intl.NumberFormat().format(
									financialOverview.sales_revenue.reduce(
										(sum, sale) => (sum += sale.revenue),
										0
									)
								)} aUEC
							</th>
						</tr>
					</thead>
					<tbody>
						{#each financialOverview.sales_revenue as r, i (i)}
							<tr>
								<td class="text-right">{r.cargo_name}</td>
								<td class="text-center">
									{r.station_name}
									<br />
									<small>{r.system_name}</small>
								</td>
								<td class="text-left">
									{Intl.NumberFormat().format(r.revenue)} aUEC
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3">No sales yet.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="flex-1">
				<table
					class={[
						"w-full divide-y divide-gray-200",
						"[&_th]:px-2 [&_th]:text-center [&_th]:text-sm [&_th]:font-semibold [&_th]:tracking-wide [&_th]:uppercase",
						"[&_thead_tr]:h-10",
						"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
						"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
						"[&_td]:px-2 [&_td]:text-sm [&_td]:whitespace-nowrap"
					]}
				>
					<thead>
						<tr>
							<th colspan="3" class="text-secondary-600">
								Expenses: {Intl.NumberFormat().format(
									financialOverview.claims.reduce(
										(sum, claim) => (sum += claim.fees),
										0
									) +
										financialOverview.event_fees.reduce(
											(sum, event) => (sum += event.fees),
											0
										)
								)} aUEC
							</th>
						</tr>
					</thead>
					<tbody>
						{#each financialOverview.claims as c, i (i)}
							<tr>
								<td class="text-right">Claim</td>
								<td class="text-center">
									{c.ship}
									<br />
									<small>{c.system}</small>
								</td>
								<td class="text-left">
									{Intl.NumberFormat().format(c.fees)} aUEC
								</td>
							</tr>
						{/each}
						{#each financialOverview.event_fees as e, i (i)}
							<tr>
								<td class="text-right">
									{e.type === "SELL" ? "Sales fees" : "Refinery fees"}
								</td>
								<td class="text-center">
									{e.station_name}
									<br />
									<small>{e.system_name}</small>
								</td>
								<td class="text-left">
									{Intl.NumberFormat().format(e.fees)} aUEC
								</td>
							</tr>
						{/each}
						{#if financialOverview.event_fees.length === 0 && financialOverview.claims.length === 0}
							<tr>
								<td colspan="3">No expenses yet.</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- member list -->
	<div class="m-4 flex-1 flex-col rounded-md bg-gray-200 p-4">
		<p class="text-center font-semibold">Member list</p>
		{#each memberList as member (member.id)}
			<div
				class={[
					"flex flex-row justify-center align-middle",
					member.was_paid
						? "bg-[repeating-linear-gradient(45deg,var(--color-green-400)_0,var(--color-green-400)_2px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed"
						: ""
				]}
			>
				<User class="flex-1" username={member.name} image={member.image} />
				{#if member.id === owner.id}
					<div class="flex flex-1 items-center justify-center gap-3 py-3 text-center">
						<small>(owner)</small>
					</div>
				{:else}
					<div class="flex flex-1 items-center justify-center gap-3 py-3 text-center">
						{#if owner.id === user.id}
							<!-- TODO: add onclick handlers (mark paid, remove from run) -->
							<Button class="h-6 min-w-fit p-2"
								><Icon class="h-4 w-4 text-secondary-600" icon={faCheck} /></Button
							>
							<Button class="h-6 min-w-fit p-2"
								><Icon class="h-4 w-4 text-secondary-600" icon={faXmark} /></Button
							>
						{/if}
					</div>
				{/if}
			</div>
		{/each}

		<div class="h-8"></div>
		<div class="flex flex-row-reverse">
			<Button
				class="h-10 min-w-fit p-2"
				onclick={() => {
					addMemberSidebarOpen = true;
				}}
			>
				Add member <Icon icon={faPlus} class="h-8 w-8" />
			</Button>
		</div>
	</div>
</div>

<!-- cargo overview -->
<div class="m-4 rounded-md bg-gray-200 p-4">
	<p class="text-center font-semibold">Cargo items</p>
	<table
		class={[
			"w-full table-auto divide-y divide-gray-200",
			"[&_th]:px-2 [&_th]:text-center [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
			"[&_thead_tr]:h-10",
			"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
			"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
			"[&_td]:px-2 [&_td]:text-center [&_td]:text-sm [&_td]:whitespace-nowrap"
		]}
	>
		<thead>
			<tr>
				<th>#</th>
				<th>Type</th>
				<th>Amount</th>
				<th>Location</th>
				<th></th>
				<!-- actions -->
			</tr>
		</thead>
		<tbody>
			{#each cargoLots as cl (cl.id)}
				<tr>
					<td>{cl.id}</td>
					<td>{cl.cargo_name}</td>
					<td>{cl.amount} SCU</td>
					<td>
						<p>{cl.station_name}</p>
						<small>{cl.system_name}</small>
					</td>
					<td class="w-72">
						<div class="flex flex-row">
							<Button
								class="m-4 h-6 min-w-fit p-2"
								disabled={!cl.is_refinable || cl.is_consumed}
							>
								Refine <Icon class="h-4 w-4" icon={faIndustry} />
							</Button>
							<Button
								class="m-4 h-6 min-w-fit p-2"
								disabled={!cl.is_commodity || cl.is_consumed}
							>
								Sell <Icon class="h-4 w-4" icon={faMoneyBillWave} />
							</Button>
							<Button class="m-4 h-6 min-w-fit p-2" disabled={cl.is_consumed}>
								Remove <Icon class="h-4 w-4" icon={faXmark} />
							</Button>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="text-center">No cargo items yet.</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="h-8"></div>
	<div class="flex flex-row-reverse">
		<Button
			class="h-10 min-w-fit p-2"
			onclick={() => {
				addCargoLotSidebarOpen = true;
			}}
		>
			Add cargo item <Icon icon={faPlus} class="h-8 w-8" />
		</Button>
	</div>
</div>

<!-- refinery jobs -->
<div class="m-4 rounded-md bg-gray-200 p-4">
	<p class="text-center font-semibold">Refinery jobs</p>
	<table
		class={[
			"w-full table-auto divide-y divide-gray-200",
			"[&_th]:px-2 [&_th]:text-center [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
			"[&_thead_tr]:h-10",
			"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
			"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
			"[&_td]:px-2 [&_td]:text-center [&_td]:text-sm [&_td]:whitespace-nowrap"
		]}
	>
		<thead>
			<tr>
				<th>#</th>
				<th>Station</th>
				<th>Start</th>
				<th>End</th>
				<th>Fees</th>
				<th>Used cargo</th>
				<th>Yield</th>
				<th></th>
				<!-- actions -->
			</tr>
		</thead>
		<tbody>
			{#each refineryJobs as rj, i (i)}
				<tr>
					<td>{rj.id}</td>
					<td>
						{rj.station_name}
						<br />
						<small>{rj.system_name}</small>
					</td>
					<td>{rj.created_at.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
					<td>{rj.finishes_at.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
					<td>{Intl.NumberFormat().format(rj.fees)} aUEC</td>
					<td>
						{rj.consumed_cargo_type}
						<br />
						<small>{Intl.NumberFormat().format(rj.consumed_cargo_amount)} SCU</small>
					</td>
					<td>
						{rj.created_cargo_type}
						<br />
						<small
							>{Intl.NumberFormat().format(rj.created_cargo_amount)} SCU, item #{rj.created_cargo_id}</small
						>
					</td>
					<td class="w-32">
						<Button class="m-4 h-6 min-w-fit p-2">
							Remove <Icon class="h-4 w-4" icon={faXmark} />
						</Button>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="8">No refinery jobs yet.</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="h-8"></div>
	<div class="flex flex-row-reverse">
		<Button
			class="h-10 min-w-fit p-2"
			onclick={() => {
				addRefineryJobSidebarOpen = true;
			}}
		>
			Add refinery job <Icon icon={faPlus} class="h-8 w-8" />
		</Button>
	</div>
</div>

<!-- sales -->
<div class="m-4 rounded-md bg-gray-200 p-4">
	<p class="text-center font-semibold">Cargo sales</p>
	<table
		class={[
			"w-full table-auto divide-y divide-gray-200",
			"[&_th]:px-2 [&_th]:text-center [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
			"[&_thead_tr]:h-10",
			"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
			"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
			"[&_td]:px-2 [&_td]:text-center [&_td]:text-sm [&_td]:whitespace-nowrap"
		]}
	>
		<thead>
			<tr>
				<th>#</th>
				<th>Station</th>
				<th>Date</th>
				<th>Fees</th>
				<th>Revenue</th>
				<th>Cargo</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each cargoSales as cs, i (i)}
				<tr>
					<td>{cs.id}</td>
					<td>
						{cs.station_name}
						<br />
						<small>{cs.system_name}</small>
					</td>
					<td>
						{cs.created_at.toLocaleString("en-GB", { timeZone: "UTC" })}
					</td>
					<td>
						{Intl.NumberFormat().format(cs.fees)} aUEC
					</td>
					<td>
						{Intl.NumberFormat().format(cs.consumed_cargo_amount * cs.price_per_unit)} aUEC
					</td>
					<td>
						{cs.consumed_cargo_type}
						<br />
						<small>{cs.consumed_cargo_amount} SCU @ {Intl.NumberFormat().format(cs.price_per_unit)} aUEC</small>
					</td>
					<td class="w-32">
						<Button class="m-4 h-6 min-w-fit p-2">
							Remove <Icon class="h-4 w-4" icon={faXmark} />
						</Button>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="7">No cargo sales yet.</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="h-8"></div>
	<div class="flex flex-row-reverse">
		<Button
			class="h-10 min-w-fit p-2"
			onclick={() => {
				addCargoSaleSidebarOpen = true;
			}}
		>
			Add cargo sale <Icon icon={faPlus} class="h-8 w-8" />
		</Button>
	</div>
</div>
