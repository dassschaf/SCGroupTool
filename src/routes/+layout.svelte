<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Icon from "$lib/components/Icon.svelte";
	import '../app.css';
	import {
		faBars,
		faHome,
		faQuestionCircle,
		faRecycle,
		faSnowflake,
		faXmark
	} from "@fortawesome/free-solid-svg-icons";
	import { page } from "$app/state";

	let { data, children } = $props();

	const navigation = [
		{
			name: "Overview",
			icon: faHome,
			href: "/"
		},

		{
			name: "About",
			icon: faQuestionCircle,
			href: "/about"
		},

		{
			name: "Salvaging",
			icon: faRecycle,
			href: "/salvage"
		}
	]

	let sidebarOpen = $state(false);

	let isActive = (href: string) => {
		return href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- close the sidebar with Escape -->
<svelte:window
	onkeydown={(e) => {
		if (e.key === "Escape") sidebarOpen = false;
	}}
	/>

<!-- main container for sidebar + content -->
<div class="min-h-screen main-background">

	<!-- sidebar backdrop -->
	<div
		class={[
			"fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
			sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
		]}
		 onclick="{() => (sidebarOpen = false)}"
	 ></div>

	<!-- sidebar -->
	<aside
		class={[
			"fixed inset-y-0 left-0 z-50 w-72 text-white transition-transform lg:translate-x-0",
			sidebarOpen ? "translate-x-0" : "-translate-x-full"
		]}>

		<div class="flex h-full flex-col px-4">
			<div class="flex h-16 items-center gap-3">
				<Icon class="h-9 w-9" icon={faSnowflake}/>
				<span class="flex-1 font-bold">Group Tool</span>

				<button
						aria-label="Close sidebar"
						class="rounded-md p-2 lg:hidden"
						onclick={() => (sidebarOpen = false)}
				>
					<Icon class="h-6 w-6" icon={faXmark} />
				</button>
			</div>

			<nav class="flex-1 py-4">
				<ul class="space-y-1">
					{#each navigation as item}
					<li>
						<a
							href="{item.href}"
							onclick="{() => (sidebarOpen = false)}"
							class={[
									"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold duration-200",
									isActive(item.href) ? "bg-gray-50 text-primary-600" : "hover:bg-primary-700"
							]}
						>
							<Icon class="h-6 w-6" icon={item.icon} />
							{item.name}
						</a>
					</li>
					{/each}
				</ul>
			</nav>

			<div class="flex items-center gap-3 py-3 text-sm font-semibold">
				<img alt="" class="h-9 w-9 rounded-full bg-white" src="{data.user.image}" />
				{data.user.name}
			</div>
		</div>
	</aside>

	<main class="min-w-0 lg:ml-72">
		<header class="flex h-16 items-center px-4 shadow-sm lg:hidden">
			<button aria-label="Open sidebar" class="rounded-md p-2" onclick="{() => (sidebarOpen = true)}">
				<Icon class="h-5 w-5 text-white" icon="{faBars}"/>
			</button>
		</header>

		<!-- empty space for consistent top margin -->
		<!-- <div class="bg-primary-600 h-2"></div> -->

		<!-- main content area -->
		<div class="h-2"></div>
		<div class="rounded-md bg-white ml-2 mr-2 p-4 top-2">
			{@render children()}
		</div>

	</main>

	<footer class=""></footer>
</div>
