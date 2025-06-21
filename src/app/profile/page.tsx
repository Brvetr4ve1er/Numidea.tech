'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, ShoppingBag, Heart, LogOut, Edit3, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  // Placeholder data
  const user = {
    name: "StickittyFan01",
    email: "user@example.com",
    avatarUrl: "https://placehold.co/128x128.png",
    joinDate: "Joined October 2023",
  };

  const favoriteStickers = [
    { id: "1", name: "Cyber Cat", imageUrl: "https://placehold.co/200x200.png", aiHint: "cyberpunk cat" },
    { id: "2", name: "Pixel Ghost", imageUrl: "https://placehold.co/200x200.png", aiHint: "pixel art ghost" },
    { id: "3", name: "Space Donut", imageUrl: "https://placehold.co/200x200.png", aiHint: "space donut" },
  ];

  const recentOrders = [
    { id: "ORD001", date: "2023-10-15", total: "$12.50", status: "Delivered" },
    { id: "ORD002", date: "2023-10-22", total: "$25.00", status: "Shipped" },
  ];

  const userCreations = [
    { id: "c1", name: "My Neon Sign", imageUrl: "https://placehold.co/200x200.png", aiHint: "neon sign" },
    { id: "c2", name: "Abstract Orb", imageUrl: "https://placehold.co/200x200.png", aiHint: "abstract design" },
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
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted">
              <TabsTrigger value="favorites" className="text-base py-2.5"><Heart className="mr-2 h-4 w-4" />Favorites</TabsTrigger>
              <TabsTrigger value="creations" className="text-base py-2.5"><Wand2 className="mr-2 h-4 w-4" />My Creations</TabsTrigger>
              <TabsTrigger value="orders" className="text-base py-2.5"><ShoppingBag className="mr-2 h-4 w-4" />Orders</TabsTrigger>
              <TabsTrigger value="settings" className="text-base py-2.5"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">Favorite Stickers</h2>
              {favoriteStickers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favoriteStickers.map(sticker => (
                    <Link href={`/store/sticker/${sticker.id}`} key={sticker.id} className="group aspect-square block bg-muted/50 rounded-lg overflow-hidden relative hover:shadow-lg transition-shadow">
                      <Image src={sticker.imageUrl} alt={sticker.name} layout="fill" objectFit="cover" data-ai-hint={sticker.aiHint} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-semibold p-2 text-center">{sticker.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/70">You haven't favorited any stickers yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="creations">
              <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">My Creations</h2>
              {userCreations.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userCreations.map(sticker => (
                    <div key={sticker.id} className="group aspect-square bg-muted/50 rounded-lg overflow-hidden relative hover:shadow-lg transition-shadow">
                      <Image src={sticker.imageUrl} alt={sticker.name} layout="fill" objectFit="cover" data-ai-hint={sticker.aiHint} />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-semibold p-2 text-center">{sticker.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-foreground/70 mb-4">No creations yet. Start designing!</p>
                  <Button asChild>
                    <Link href="/generator">
                      <Wand2 className="mr-2 h-4 w-4" /> Create a Sticker
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

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
