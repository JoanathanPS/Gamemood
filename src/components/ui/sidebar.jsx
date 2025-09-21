import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    return setOpen((open) => !open)
  }, [setOpen])

  const contextValue = React.useMemo(() => ({
    state: open ? "expanded" : "collapsed",
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  }), [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="group/sidebar-wrapper flex min-h-svh w-full">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const Sidebar = ({ children, className, ...props }) => {
  const { isMobile, state, openMobile } = useSidebar()

  if (isMobile) {
    return (
      <div
        className={cn(
          "group/sidebar fixed inset-y-0 z-10 hidden h-svh w-64 flex-col bg-sidebar text-sidebar-foreground shadow-lg data-[state=open]:flex",
          "left-0",
          className
        )}
        data-state={openMobile ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group/sidebar flex h-full flex-col bg-sidebar text-sidebar-foreground",
        "data-[state=collapsed]:w-0 data-[state=collapsed]:overflow-hidden",
        "data-[state=expanded]:w-64",
        "border-r",
        className
      )}
      data-state={state}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarTrigger = ({ className, onClick, ...props }) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

const SidebarHeader = ({ className, ...props }) => (
  <div
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
)

const SidebarContent = ({ className, ...props }) => (
  <div
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      className
    )}
    {...props}
  />
)

const SidebarFooter = ({ className, ...props }) => (
  <div
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
)

const SidebarGroup = ({ className, ...props }) => (
  <div
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
)

const SidebarGroupLabel = ({ className, ...props }) => (
  <div
    data-sidebar="group-label"
    className={cn(
      "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2",
      className
    )}
    {...props}
  />
)

const SidebarGroupContent = ({ className, ...props }) => (
  <div
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
)

const SidebarMenu = ({ className, ...props }) => (
  <ul
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
)

const SidebarMenuItem = ({ className, ...props }) => (
  <li
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
)

const SidebarMenuButton = ({ className, asChild = false, isActive = false, ...props }) => {
  const Comp = asChild ? "div" : "button"

  return (
    <Comp
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}