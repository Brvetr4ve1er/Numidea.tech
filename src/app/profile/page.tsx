
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ShoppingBag, LogOut, Edit3 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  // Placeholder data
  const user = {
    name: "TechFan01",
    email: "user@example.com",
    avatarUrl: "https://placehold.co/128x128.png",
    joinDate: "Joined June 2024",
  };

  const recentOrders = [
    { id: "ORD001", date: "2024-06-15", total: "35,000 DZD", status: "Delivered" },
    { id: "ORD002", date: "2024-06-22", total: "55,000 DZD", status: "Shipped" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="bg-card shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary mb-4 md:mb-0 md:mr-6">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h1 className="font-headline text-3xl md:text-4xl text-primary mb-1 tracking-wide">{user.name}</h1>
            <p className="text-foreground/80 text-sm">{user.email}</p>
            <p className="text-foreground/70 text-xs mt-1">{user.joinDate}</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-6 bg-muted">
              <TabsTrigger value="orders" className="text-base py-2.5"><ShoppingBag className="mr-2 h-4 w-4" />Orders</TabsTrigger>
              <TabsTrigger value="settings" className="text-base py-2.5"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">Order History</h2>
              {recentOrders.length > 0 ? (
                <ul className="space-y-4">
                  {recentOrders.map(order => (
                    <li key={order.id} className="p-4 border border-border rounded-lg flex justify-between items-center bg-muted/20">
                      <div>
                        <p className="font-semibold text-foreground/90">Order ID: {order.id}</p>
                        <p className="text-sm text-foreground/70">Date: {order.date} | Total: {order.total}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${order.status === "Delivered" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center py-8">
                  <p className="text-foreground/70 mb-4">You haven't placed any orders yet.</p>
                  <Button asChild variant="outline">
                    <Link href="/store">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Go to Store
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">Account Settings</h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground/80 mb-1">Username</label>
                  <Input type="text" id="username" defaultValue={user.name} className="bg-background" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
                  <Input type="email" id="email" defaultValue={user.email} className="bg-background" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1">Change Password</label>
                  <Input type="password" id="password" placeholder="New Password" className="bg-background" />
                </div>
                <Button className="bg-primary hover:bg-accent text-primary-foreground">Save Changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
