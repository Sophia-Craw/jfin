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
        BedDouble,
        ChevronsDownUp,
        ChevronsUpDown,
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

<Sidebar variant="floating" class="pt-9">
    <SidebarContent>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton class="cursor-pointer" isActive={page.url.pathname === "/"}>
                            {#snippet child({ props })}
                                <a href="/" {...props}>
                                    <Home />
                                    Home
                                </a>
                            {/snippet}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel>Libraries</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {#each libraries as item}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                class="cursor-pointer"
                                isActive={currLib == item.Id || page.params.id === item.Id}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={"/library/" + item.Id}
                                        {...props}
                                        onclick={() => {
                                            currLib = item.Id
                                        }}
                                    >
                                    <Library />
                                    {item.Name}
                                    </a>
                                {/snippet}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    {/each}
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel>Library Categories</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {#if currLib}
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}`} class="cursor-pointer">
                                {#snippet child({ props })}
                                    <a href={currLib ? "/library/" + currLib : "/"} {...props}>
                                        <DiscAlbum />
                                        Albums
                                    </a>
                                {/snippet}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}/artists`} class="cursor-pointer">
                                {#snippet child({ props })}
                                    <a href={currLib ? "/library/" + currLib + "/artists" : "/"} {...props}>
                                        <User />
                                        Artists
                                    </a>
                                {/snippet}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={page.url.pathname === `/library/${currLib}/tracks`} class="cursor-pointer">
                                {#snippet child({ props })}
                                    <a href={currLib ? "/library/" + currLib + "/tracks" : "/"} {...props}>
                                        <Music />
                                        Tracks
                                    </a>
                                {/snippet}
                            </SidebarMenuButton>
                        </SidebarMenuItem>              
                    {/if}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="w-full">
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger class="w-full">
                        <Item class="flex justify-between cursor-pointer hover:bg-secondary w-full">
                            <ItemMedia variant="image">
                                <Avatar>
                                    <AvatarImage src="/api/user/{data.User.Id ? data.User.Id : ""}/avatar"/>
                                </Avatar>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle class="line-clamp-1">{data.User.Name ? data.User.Name : "Log In"}</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ChevronsUpDown class="opacity-50" />
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
        </SidebarMenu>
    </SidebarFooter>
</Sidebar>
