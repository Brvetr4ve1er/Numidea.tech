
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, ShoppingBag, UploadCloud, Mail } from "lucide-react";
import Link from "next/link";

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) => (
  <Card className="bg-card shadow-lg hover:shadow-primary/10 transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
      <div className="text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="font-headline text-4xl sm:text-5xl text-primary tracking-wider">Admin Dashboard</h1>
        <p className="text-lg text-foreground/80">Welcome, Admin! Manage your StickyTech empire.</p>
      </header>

      {/* Stats Overview */}
      <section className="mb-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Orders" value="1,234" icon={<ShoppingBag size={20} />} description="+20.1% from last month" />
          <StatCard title="Active Users" value="567" icon={<Users size={20} />} description="+180.1% from last month" />
          <StatCard title="Total Revenue" value="$12,873" icon={<BarChart size={20} />} description="+12.5% from last month" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button size="lg" variant="outline" className="justify-start py-6 text-base" asChild>
            <Link href="#"><UploadCloud className="mr-3 h-5 w-5 text-primary" /> Upload New Product</Link>
          </Button>
          <Button size="lg" variant="outline" className="justify-start py-6 text-base" asChild>
            <Link href="#"><ShoppingBag className="mr-3 h-5 w-5 text-primary" /> Monitor Orders</Link>
          </Button>
          <Button size="lg" variant="outline" className="justify-start py-6 text-base" asChild>
            <Link href="#"><Mail className="mr-3 h-5 w-5 text-primary" /> Send Newsletter</Link>
          </Button>
        </div>
      </section>

      {/* Recent Activity (Placeholder) */}
      <section>
        <h2 className="font-headline text-2xl text-primary mb-4 tracking-wide">Recent Activity</h2>
        <Card className="bg-card shadow-lg">
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="text-sm text-foreground/90"><span className="font-semibold text-primary">New Order:</span> #ORD1235 placed by user@example.com</li>
              <li className="text-sm text-foreground/90"><span className="font-semibold text-primary">New User:</span> testuser signed up.</li>
              <li className="text-sm text-foreground/90"><span className="font-semibold text-primary">Product Added:</span> 'Note 12' added to inventory.</li>
              <li className="text-sm text-foreground/90"><span className="font-semibold text-primary">Quote Request:</span> New request for Web Design from client@email.com.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
