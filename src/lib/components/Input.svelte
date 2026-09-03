<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements";

    let {
        element = $bindable(),
        value = $bindable(),
        class: classValue,
        before,
        after,
        ...restProps
    }: (
        | ({
        rows: number;
    } & HTMLTextareaAttributes)
        | ({
        rows?: undefined;
    } & HTMLInputAttributes)
        ) & {
        before?: Snippet;
        after?: Snippet;
        element?: HTMLTextAreaElement | HTMLInputElement;
    } = $props();
</script>

{#if restProps.rows !== undefined}
    <label
            class={[
			'flex items-center gap-2 rounded-md border border-gray-300 px-3 transition-colors focus-within:border-primary-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-600',
			restProps['aria-invalid'] &&
				'border-red-500 focus-within:border-red-500 focus-within:outline-red-500',
			classValue
		]}
    >
        {@render before?.()}

        <textarea
                bind:this={element}
                bind:value
                {...restProps}
                class="w-full resize-none border-none bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
        ></textarea>

        {@render after?.()}
    </label>
{:else if restProps.type === 'checkbox'}
    <!-- TODO -->
{:else}
    <label
            class={[
			'flex items-center gap-3 rounded-md border border-gray-300 px-3 transition-colors focus-within:border-primary-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-600',
			restProps['aria-invalid'] &&
				'border-red-500 focus-within:border-red-500 focus-within:outline-red-500',
			classValue
		]}
    >
        {@render before?.()}

        <input
                bind:this={element}
                bind:value
                {...restProps}
                class="h-9 w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
        />

        {@render after?.()}
    </label>
{/if}