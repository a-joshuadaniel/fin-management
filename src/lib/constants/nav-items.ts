import {
  CreditCard,
  LayoutDashboard,
  Landmark,
  PiggyBank,
  Receipt,
  Settings,
} from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
  },
  {
    title: "Loans & EMIs",
    href: "/loans",
    icon: Landmark,
  },
  {
    title: "Savings",
    href: "/savings",
    icon: PiggyBank,
  },
  {
    title: "Tax",
    href: "/tax",
    icon: Receipt,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;
