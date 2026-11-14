<script lang="ts">
    import { page } from '$app/state';
</script>

<p class="p-4">
    {page.status}
    <br/>
    <small>{page.error.message}</small>
</p>