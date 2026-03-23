<script>
    import { page } from "$app/state";
    import { Collapsible } from "bits-ui";
    import { SidebarGroupLabel } from "./ui/sidebar";
    import SidebarContent from "./ui/sidebar/sidebar-content.svelte";
    import SidebarGroupContent from "./ui/sidebar/sidebar-group-content.svelte";
    import SidebarGroup from "./ui/sidebar/sidebar-group.svelte";
    import SidebarMenuButton from "./ui/sidebar/sidebar-menu-button.svelte";
    import SidebarMenuItem from "./ui/sidebar/sidebar-menu-item.svelte";
    import SidebarMenuSub from "./ui/sidebar/sidebar-menu-sub.svelte";
    import SidebarMenu from "./ui/sidebar/sidebar-menu.svelte";
    import SidebarSeparator from "./ui/sidebar/sidebar-separator.svelte";
    import Sidebar from "./ui/sidebar/sidebar.svelte";
    import {
        Home,
        LibraryBig,
        DiscAlbum,
        Disc,
        Library,
        Settings,
        Plus,
        PersonStanding,
        User2,
        User,
        Music,
    } from "@lucide/svelte";
    import SidebarFooter from "./ui/sidebar/sidebar-footer.svelte";
    import SidebarGroupAction from "./ui/sidebar/sidebar-group-action.svelte";
    import { onMount } from "svelte";
    import { currentLib } from "$lib/stores";

    const { data } = $props();

    let currLib = $state(page.params.id)

    onMount(() => {
        currentLib.subscribe((lib) => {
            currLib = lib
        })
    })
</script>

<Sidebar>
    <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Libraries</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {#each data.Libraries.Items as item}
                        {#if item.Type == "Folder"}
                            <a href={"/library/" + item.Id}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton class="cursor-pointer"
                                        isActive={currLib == item.Id || page.params.id === item.Id}
                                        onclick={() => {
                                            currLib = item.Id
                                        }}
                                    >
                                        <Library />
                                        {item.Name}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </a>
                        {/if}
                    {/each}
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href={currLib ? "/library/" + currLib : "/"}>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}`} class="cursor-pointer">
                                <DiscAlbum />
                                Albums
                            </SidebarMenuButton>
                        </a>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <a href={currLib ? "/library/" + currLib + "/artists": "/"}>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}/artists`}  class="cursor-pointer">
                                <User />
                                Artists
                            </SidebarMenuButton>
                        </a>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <a href={currLib ? "/library/" + currLib + "/tracks": "/"}>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}/tracks`}  class="cursor-pointer">
                                <Music />
                                Tracks
                            </SidebarMenuButton>                        
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
        <SidebarMenuItem>
            <SidebarMenuButton class="cursor-pointer">
                <Settings />
                Settings
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarFooter>
</Sidebar>
