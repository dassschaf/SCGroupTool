<script lang="ts">
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

    let {
        class: classValue,
        children,
        withBorder = false,
        ...restProps
    }:
        | ({
        href: string;
        withBorder?: boolean
    } & HTMLAnchorAttributes)
        | ({
        href?: undefined;
        withBorder?: boolean
    } & HTMLButtonAttributes) = $props();

    const baseClasses = "flex justify-center items-center text-center gap-3 py-1 m-1 text-sm bg-white text-secondary-600 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600 disabled:cursor-not-allowed disabled:opacity-50 p-1 justify-center";
</script>

{#if restProps.href !== undefined}
    <a {...restProps} class={[
        baseClasses,
        classValue,
        restProps.disabled ? "pointer-events-none" : "hover:bg-secondary-600 hover:text-white transition-colours duration-200",
        withBorder && !restProps.disabled ? "outline-secondary-600" : ""
    ]}>
        {@render children?.()}
    </a>
{:else}
    <button {...restProps} class={[
        baseClasses,
        classValue,
        restProps.disabled ? "pointer-events-none" : "hover:bg-secondary-600 hover:text-white transition-colours duration-200",
        withBorder && !restProps.disabled ? "outline-secondary-600" : ""
    ]}>
        {@render children?.()}
    </button>
{/if}