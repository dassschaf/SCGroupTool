<script lang="ts">
	import PageHeading from "$lib/components/PageHeading.svelte";
	import FormSidebar from "$lib/components/FormSidebar.svelte";
	import type { PageProps } from "./$types";
	import {getCargoTypeById, getCargoTypes, getStationById, getStations} from "$lib/database/universe.remote";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import { addCargoLot } from "$lib/database/cargo.remote";
	import { faArrowLeft, faPencil } from "@fortawesome/free-solid-svg-icons";
	import { error } from "@sveltejs/kit";
	import StationSearch from "$lib/components/StationSearch.svelte";
	import CargoTypeSearch from "$lib/components/CargoTypeSearch.svelte";

	let typeID = $state(0);
	let stationID = $state(0);
	let cargoAmount = $state(0);
	let buttonOK = $derived(typeID !== 0 && stationID !== 0 && cargoAmount > 0);

	let { params }: PageProps = $props();

	let cargoSidebarOpen = $state(false);
	let stationSidebarOpen = $state(false);
	let anySidebarOpen = $derived(cargoSidebarOpen || stationSidebarOpen);

	let srid = Number(params.id);
	if (Number.isNaN(srid)) error(400, "Invalid salvage run ID.");
</script>

<!-- sidebar backdrop -->
<div
	class={[
		"fixed inset-0 z-50 bg-black/50 transition-opacity",
		anySidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
	]}
	onclick={() => {
		cargoSidebarOpen = false;
		stationSidebarOpen = false;
	}}
></div>

<FormSidebar bind:sidebarFlag={stationSidebarOpen} formHeading="Select station">
	<StationSearch bind:sidebarFlag={stationSidebarOpen} bind:id={stationID} />
</FormSidebar>

<FormSidebar bind:sidebarFlag={cargoSidebarOpen} formHeading="Select cargo type">
	<CargoTypeSearch bind:sidebarFlag={cargoSidebarOpen} bind:id={typeID} />
</FormSidebar>

<div class="flex flex-col">
	<div class="align-center flex flex-row items-center p-4">
		<Button class="h-10 w-10 rounded-md" href="/salvage/{srid}">
			<Icon icon={faArrowLeft} />
		</Button>
		<PageHeading>run #{params.id} &mdash; Add cargo lot</PageHeading>
	</div>

	<!-- submit preview w/ form -->
	<div class="m-2 p-2">
		<form class="flex flex-col p-4" {...addCargoLot}>
			<div class="flex flex-row">
				<div class="flex-1 p-2">
					<small>Selected cargo:</small>
					<div class="flex flex-row py-1">
						<p class="flex-1">
							{typeID !== 0
								? (await getCargoTypeById(typeID)).name
								: "—"}
						</p>
						<Button
							class="h-6 min-w-fit p-2"
							type="button"
							onclick={() => {
								cargoSidebarOpen = true;
							}}
						>
							<Icon class="h-4 w-4" icon={faPencil} />
						</Button>
					</div>
					<input {...addCargoLot.fields.cargo_type.as("hidden", typeID)} />
				</div>
				<div class="flex-1 p-2">
					<small>Selected station:</small>
					<div class="flex flex-row py-1">
						<p class="flex-1">
							{#if stationID !== 0}
								{(await getStationById(stationID)).name}
								<br>
								<small>{(await getStationById(stationID)).system} &mdash; Refinery: {(await getStationById(stationID)).has_refinery} &mdash; Market: {(await getStationById(stationID)).has_market}</small>
							{:else}
								&mdash;
							{/if}
						</p>
						<Button
							class="h-6 min-w-fit p-2"
							type="button"
							onclick={() => {
								stationSidebarOpen = true;
							}}
						>
							<Icon class="h-4 w-4" icon={faPencil} />
						</Button>
					</div>
					<input {...addCargoLot.fields.station.as("hidden", stationID)} />
				</div>
				<div class="flex-1 p-2">
					<small>Amount:</small>
					<Input
						name="amount"
						type="number"
						bind:value={cargoAmount}
						autocomplete="off"
						autofocus
						class="mb-2 w-full"
						placeholder="Search cargo types..."
					/>
				</div>
			</div>
			<div class="h-2"></div>
			<div class="flex flex-row-reverse">
				<Button
					class="h-12 min-w-fit p-4"
					{...addCargoLot.fields.srid.as("submit", srid)}
					disabled={!buttonOK}
				>
					Add cargo lot
				</Button>
			</div>
		</form>
	</div>
</div>
