"use client";

import { Header } from "@/components/layout/header";
import Link from "next/link";
import { navItems } from "@/lib/constants/nav-items";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const pages = navItems.filter((item) => item.href !== "/" && item.href !== "/settings");

  return (
    <div>
      <Header
        title="Dashboard"
        description="Personal financial management"
      />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const Icon = page.icon;
            const isPlaceholder = page.href !== "/credit-cards";
            return (
              <Link key={page.href} href={page.href}>
                <Card className="transition-colors hover:bg-accent/50 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{page.title}</CardTitle>
                        <CardDescription>
                          {isPlaceholder ? "Coming soon" : "Track billing cycles & due dates"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
