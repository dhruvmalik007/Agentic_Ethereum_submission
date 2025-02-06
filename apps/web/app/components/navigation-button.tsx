"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@repo/ui";

interface NavigationButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string;
}

export function NavigationButton({ href, children, ...props }: NavigationButtonProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(href)} {...props}>
      {children}
    </Button>
  );
}
