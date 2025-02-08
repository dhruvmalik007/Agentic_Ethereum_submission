export type headerOptions = {
    title: string
    href: string
    disabled?: boolean  
}

export type NavItem = {
    title: string
    href: string
    disabled?: boolean
  }
  
  export type MainNavItem = NavItem
  

export type Header = {
    options: headerOptions[]
}

export const headerButtons : Header= {
    options :[
        {
        title: "Docs",
        href: "/docs",
    },
    {
        title: "Examples",
        href: "/examples",
    },
    {
        title: "Blog",
        href: "/blog",
    }
    ]
}