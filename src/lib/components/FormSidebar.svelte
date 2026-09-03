<script lang="ts">
	import { faXmark } from "@fortawesome/free-solid-svg-icons";
	import Icon from "$lib/components/Icon.svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let {
		sidebarFlag = $bindable(),
		formHeading,
		children
	}: {
		sidebarFlag: boolean;
		formHeading: string;
	} & HTMLBaseAttributes = $props();
</script>

<div
	class={[
		"main-background fixed inset-y-0 right-0 z-50 w-1/2 text-white transition-transform",
		sidebarFlag ? "translate-x-0" : "translate-x-full"
	]}
>
	<div class="flex h-full flex-col px-4">
		<div class="flex h-16 flex-row items-center justify-center gap-3 align-middle">
			<button
				aria-label="Close sidebar"
				class="rounded-md p-2"
				onclick={() => (sidebarFlag = false)}
			>
				<Icon class="h-6 w-6" icon={faXmark} />
			</button>

			<h1 class="text-heading flex-auto text-center text-4xl font-bold tracking-tight">
				{formHeading}
			</h1>
		</div>

		<!-- gap -->
		<div class="h-8"></div>

		{@render children?.()}
	</div>
</div>
