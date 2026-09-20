<script lang="ts">
    import type { ClassValue, HTMLBaseAttributes } from 'svelte/elements';

    let {
        class: classValue
        children
    }: {
        class?: ClassValue
    } & HTMLBaseAttributes = $props;
</script>

<table
	class={[
		"w-full divide-y divide-gray-200",
		"[&_th]:px-2 [&_th]:text-center [&_th]:text-sm [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-primary-600 [&_th]:uppercase",
		"[&_thead_tr]:h-10",
		"[&_tbody]:divide-y [&_tbody]:divide-gray-300",
		"[&_tbody_tr]:h-10 [&_tbody_tr]:hover:bg-gray-300",
		"[&_td]:px-2 [&_td]:text-sm [&_td]:whitespace-nowrap",
		classValue
	]}
>
    {@render children()}
</table>
