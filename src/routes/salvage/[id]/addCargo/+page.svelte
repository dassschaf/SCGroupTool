<script lang="ts">
	import PageHeading from "$lib/components/PageHeading.svelte";
	import type { PageProps } from "./$types";
	import { getCargoTypes, getStations } from "$lib/database/universe.remote";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import { addCargoLot } from "$lib/database/cargo.remote";
	import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
	import { error } from "@sveltejs/kit";

	let typeSearch = $state("");
	let typeID = $state(0);
	let stationSearch = $state("");
	let stationID = $state(0);
	let cargoAmount = $state(0);

	let { params }: PageProps = $props();

	let cargoSidebarOpen = $state(false);
	let stationSidebarOpen = $state(false);
	let anySidebarOpen = $derived(cargoSidebarOpen || stationSidebarOpen);
	let closeSidebars = () => {
		cargoSidebarOpen = false;
		stationSidebarOpen = false;
	}

	let srid = Number(params.id);
	if (Number.isNaN(srid)) error(400, "Invalid salvage run ID.");
</script>

<!-- sidebar backdrop -->
<div
		class={[
		"fixed inset-0 z-50 bg-black/50 transition-opacity",
		anySidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
	]}
		onclick={closeSidebars()}
></div>


<div class="flex flex-col">
	<div class="align-center flex flex-row items-center p-4">
		<Button class="h-10 w-10 rounded-md" href="/salvage/{srid}">
			<Icon icon={faArrowLeft} />
		</Button>
		<PageHeading>run #{params.id} &mdash; Add cargo lot</PageHeading>
	</div>

	<div class="flex-1 flex-row p-2">
		<div class="flex-1 flex-col p-2">
			<small class="p-2">Cargo type</small>
			<Input
				bind:value={typeSearch}
				autocomplete="off"
				autofocus
				class="mb-2 w-full"
				placeholder="Search cargo types..."
				type="search"
			/>
			{#if typeSearch.length > 2}
				{#each (await getCargoTypes()).filter((ct) => ct.name
						.toLowerCase()
						.includes(typeSearch.toLowerCase())) as ct (ct.id)}
					<Button
						class="m-2 min-h-fit min-w-fit p-2"
						onclick={() => {
							typeID = ct.id;
							typeSearch = ""; // reset search
						}}
					>
						{ct.name}
					</Button>
				{/each}
			{/if}
		</div>

		<div class="flex flex-1 flex-col p-2">
			<small class="p-2">Station</small>
			<Input
				id="clStationSearch"
				bind:value={stationSearch}
				autocomplete="off"
				autofocus
				class="mb-2 w-full"
				placeholder="Search stations..."
				type="search"
			/>
			<div class="flex flex-1 p-2">
				{#if stationSearch.length > 2}
					{#each (await getStations()).filter((st) => st.name
							.toLowerCase()
							.includes(stationSearch.toLowerCase())) as st (st.id)}
						<Button
							class="m-2 min-h-fit min-w-fit p-2"
							onclick={() => {
								stationID = st.id;
								stationSearch = ""; // reset search
							}}
						>
							{st.name}
							<br />
							<small>{st.system}</small>
						</Button>
					{/each}
				{/if}
			</div>
		</div>

		<div class="flex flex-1 flex-col p-2">
			<small class="p-2">Amount</small>
			<Input
				bind:value={cargoAmount}
				autocomplete="off"
				autofocus
				class="mb-2 w-full"
				placeholder="Search cargo types..."
				type="number"
			/>
		</div>
	</div>

	<!-- submit preview w/ form -->
	<div class="m-2 p-2">
		<small>Cargo lot preview:</small>
		<form class="flex flex-col p-4" {...addCargoLot}>
			<div class="flex flex-row">
				<div class="flex-1 p-2">
					<small>Selected cargo:</small>
					<p>
						{typeID !== 0
							? (await getCargoTypes()).find((e) => e.id === typeID).name
							: "—"}
					</p>
					<input {...addCargoLot.fields.cargo_type.as("hidden", typeID)} />
				</div>
				<div class="flex-1 p-2">
					<small>Selected station:</small>
					<p>
						{stationID !== 0
							? (await getStations()).find((s) => s.id === stationID).name
							: "—"}
					</p>
					<input {...addCargoLot.fields.station.as("hidden", stationID)} />
				</div>
				<div class="flex-1 p-2">
					<small>Amount:</small>
					<p>{cargoAmount > 0 ? `${cargoAmount} SCU` : "—"}</p>
					<input {...addCargoLot.fields.amount.as("hidden", cargoAmount)} />
				</div>
			</div>
			<div class="h-2"></div>
			<div class="flex flex-row-reverse">
				<Button class="h-12 min-w-fit p-4" {...addCargoLot.fields.srid.as("submit", srid)}>
					Add cargo lot
				</Button>
			</div>
		</form>
	</div>
</div>
