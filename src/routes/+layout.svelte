<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.scss';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- TODO: collapsible sidebar for menu -->
<aside id="sidebar">
	<nav>
		<ul>
			<li>navigation :)</li>
			<li><a href="/">home</a></li>
			<li><a href="/about">about</a></li>
		</ul>
	</nav>

	<div class="grid">
		<div class="cell has-text-weight-bold">
			{data.user.name}
		</div>
		<div class="cell">
			<img class="is-rounded" src="{data.user.image}" />
		</div>
	</div>
</aside>

{@render children()}

<!-- TODO: make footer stick to bottom of page, but not stickied to bottom of screen -->
<footer class="footer">
	<div class="content has-text-centered">
		this is potentially a footer!
	</div>
</footer>