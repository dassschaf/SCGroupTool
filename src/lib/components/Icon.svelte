<script lang="ts">
    import type { IconDefinition, IconPathData } from '@fortawesome/fontawesome-common-types';
    import type { ClassValue } from 'svelte/elements';

    let { icon, class: classValue }: { icon: IconDefinition; class?: ClassValue } = $props();

    const [w, h, , , svgPathData] = icon.icon;

    const paths: string[] =
        typeof svgPathData === 'string'
            ? [svgPathData]
            : (svgPathData as Exclude<IconPathData, string>);
</script>

{#if paths.length}
    <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 {w} {h}"
            fill="currentColor"
            class={['overflow-visible', classValue]}
            aria-hidden="true"
            focusable="false"
    >
        {#each paths as d (d)}
            <path {d} />
        {/each}
    </svg>
{/if}