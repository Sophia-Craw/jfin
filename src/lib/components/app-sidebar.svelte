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
        Scale,
        ChevronUp,
        LogOut,
    } from "@lucide/svelte";
    import SidebarFooter from "./ui/sidebar/sidebar-footer.svelte";
    import SidebarGroupAction from "./ui/sidebar/sidebar-group-action.svelte";
    import { onMount } from "svelte";
    import { currentLib } from "$lib/stores";
    import Avatar from "./ui/avatar/avatar.svelte";
    import AvatarImage from "./ui/avatar/avatar-image.svelte";
    import Item from "./ui/item/item.svelte";
    import ItemMedia from "./ui/item/item-media.svelte";
    import ItemContent from "./ui/item/item-content.svelte";
    import ItemTitle from "./ui/item/item-title.svelte";
    import ItemDescription from "./ui/item/item-description.svelte";
    import ItemActions from "./ui/item/item-actions.svelte";
    import DropdownMenu from "./ui/dropdown-menu/dropdown-menu.svelte";
    import DropdownMenuTrigger from "./ui/dropdown-menu/dropdown-menu-trigger.svelte";
    import DropdownMenuContent from "./ui/dropdown-menu/dropdown-menu-content.svelte";
    import DropdownMenuGroup from "./ui/dropdown-menu/dropdown-menu-group.svelte";
    import DropdownMenuItem from "./ui/dropdown-menu/dropdown-menu-item.svelte";
    import Separator from "./ui/separator/separator.svelte";
    import { goto } from "$app/navigation";

    const { data } = $props();

    const libraries = $derived(data.Libraries.Items)

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
                    {#each libraries as item}
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
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Item class="cursor-pointer hover:bg-secondary">
                        <ItemMedia variant="image">
                            <Avatar>
                                <AvatarImage src="/api/user/{data.User.Id ? data.User.Id : ""}/avatar"/>
                            </Avatar>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle class="line-clamp-1">{data.User.Name ? data.User.Name : "Log In"}</ItemTitle>
                            <ItemDescription class="line-clamp-1">{data.User.Address ? data.User.Address : "Log In"}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronUp class="opacity-50" />
                        </ItemActions>
                    </Item>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem class="cursor-pointer">
                            <User />
                            Edit Profile
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem class="cursor-pointer" variant="destructive" onclick={() => {
                            goto("/api/logout")
                        }}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarFooter>
</Sidebar>
