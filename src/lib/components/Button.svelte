<script lang="ts">
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

    let {
        class: classValue,
        children,
        ...restProps
    }:
        | ({
        href: string;
    } & HTMLAnchorAttributes)
        | ({
        href?: undefined;
    } & HTMLButtonAttributes) = $props();

    const baseClasses = "flex justify-center items-center text-center gap-3 py-1 m-1 text-sm text-white bg-secondary-600 rounded-md transition-colours hover:bg-secondary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600  disabled:cursor-not-allowed disabled:opacity-50 p-1 justify-center";
</script>

{#if restProps.href !== undefined}
    <a {...restProps} class={[baseClasses, classValue]}>
        {@render children?.()}
    </a>
{:else}
    <button {...restProps} class={[baseClasses, classValue]}>
        {@render children?.()}
    </button>
{/if}