<script lang="ts" generics="RQType">
    // RQType is the result of `typeof myRemoteQuery`

    // imported components
    import FormSidebar from "$lib/components/FormSidebar.svelte"

    // properties
    let {
        searchFunction,         // search remote function
        formHeading,
        searchHint,
        searchPlaceholder = "Search text goes here...",
        filterFunction,

        sidebarFlag = $bindable(),
        searchResult = $bindable(undefined),
    }: {
        searchFunction: RQType
        formHeading: string;
        searchHint: string;
        searchPlaceholder: string;
        filterFunction: (item: QueryOutput<RQType>) => boolean;

        sidebarFlag: boolean;
        searchResult: number | string;
    } = $props();

    let searchValue = $state("");
</script>

<FormSidebar bind:sidebarFlag={sidebarFlag} formHeading={formHeading}>
    <div class="flex flex-col p-2">
        <small class="p-2">{searchHint}</small>
        <Input
            bind:value={searchValue}
            autocomplete="off"
            autofocus
            class="w-full mb-2"
            placeholder={serachPlaceholder}
            type="search"
        />
        <div class="flex flex-1">
            {#if searchValue.length > 2}
                {#each (await searchFunction())}
        </div>
    </div>
</FormSidebar>
