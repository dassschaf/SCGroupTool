<script lang="ts">
	import { getJoinedSalvageRuns, createSalvageRun } from "$lib/database/salvage.remote";
	import User from "$lib/components/User.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import { faPlus, faRocket } from "@fortawesome/free-solid-svg-icons";
	import PageHeading from "$lib/components/PageHeading.svelte";

	let newestRunID = $derived((await getJoinedSalvageRuns()).findLast((e) => !e.is_finished).id);
</script>

<!-- headline -->
<PageHeading>Salvage runs</PageHeading>

<div class="p-4">
	<table
		class={[
			"w-full table-auto divide-y divide-gray-200",
			"[&_th]:px-2 [&_th]:text-center [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
			"[&_thead_tr]:h-10",
			"[&_tbody]:divide-y [&_tbody]:divide-gray-200",
			"[&_tbody_tr]:h-10",
			"[&_td]:px-2 [&_td]:text-center [&_td]:text-sm [&_td]:whitespace-nowrap"
		]}
	>
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
			{#each await getJoinedSalvageRuns() as sr (sr.id)}
				<tr
					class={[
						sr.is_finished
							? "bg-[repeating-linear-gradient(45deg,var(--color-secondary-200)_0,var(--color-secondary-200)_2px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed"
							: "",
						newestRunID === sr.id
							? "bg-lime-100 hover:bg-lime-200"
							: "hover:bg-gray-50"
						]}
				>
					<td class="font-semibold">{sr.id}</td>
					<td><User username={sr.owner_name} image={sr.owner_image} /></td>
					<td>{sr.created_at.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
					<td>{sr.member_count}</td>
					<td>{Intl.NumberFormat().format(sr.profit ? sr.profit : 0)} aUEC</td>
					<td>
						{#if sr.is_finished}
							<Button class="w-full" disabled>
								Continue <Icon class="ml-3 h-8 w-8" icon={faRocket} />
							</Button>
						{:else}
							<Button class="w-full" href="/salvage/{sr.id}">
								Continue <Icon class="ml-3 h-8 w-8" icon={faRocket} />
							</Button>
						{/if}
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6"> You're not part of any salvage runs (yet). </td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- add button to open right side sidebar -->
	<div class="h-8"></div>
	<form {...createSalvageRun}>
		<Button
			data-sveltekit-preload-code="off"
			data-sveltekit-preload-data="off"
			class="float-right max-h-9 gap-3 rounded-full p-2"
			onclick={async () => { await getJoinedSalvageRuns().refresh() }}
		>
			<Icon class="h-8 w-8" icon={faPlus} />
			Start new salvage run
		</Button>
	</form>
</div>
