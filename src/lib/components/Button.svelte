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

    const baseClasses = "flex justify-center items-center text-center gap-3 py-1 m-1 text-sm bg-white text-secondary-600 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600 disabled:cursor-not-allowed disabled:opacity-50 p-1 justify-center";
</script>

{#if restProps.href !== undefined}
    <a {...restProps} class={[
        baseClasses,
        classValue,
        "hover:bg-secondary-600 hover:text-white transition-colours duration-200"
        ]}>
        {@render children?.()}
    </a>
{:else}
    <button {...restProps} class={[
        baseClasses,
        classValue,
        restProps.disabled
        ? "" // true
        : "hover:bg-secondary-600 hover:text-white transition-colours duration-200" // false
    ]}>
        {@render children?.()}
    </button>
{/if}