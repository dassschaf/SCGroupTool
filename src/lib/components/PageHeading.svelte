<script lang="ts">
    import type {HTMLBaseAttributes} from "svelte/elements";

    let {
        class: classValue,
        children
    }: HTMLBaseAttributes = $props();
</script>

<h1 class={[
    "text-heading flex-auto text-center text-4xl font-bold tracking-tight p-4",
    classValue
]}>
    {@render children?.()}
</h1>