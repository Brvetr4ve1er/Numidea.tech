
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Palette, Rocket, Bot, Printer, Search, Send } from "lucide-react";

const services = [
    {
        icon: <Rocket size={28} />,
        title: "Web Design Packages",
        description: "Modern, responsive websites for your business, starting from 30,000 DZD.",
    },
    {
        icon: <Palette size={28} />,
        title: "Branding & Logo Creation",
        description: "Get a complete visual identity that stands out from the competition.",
    },
    {
        icon: <Bot size={28} />,
        title: "Social Media Automation",
        description: "Automate customer communication on WhatsApp & Messenger using n8n.",
    },
    {
        icon: <Printer size={28} />,
        title: "Print Design & Stickers",
        description: "Professional designs for business cards, flyers, and custom stickers.",
    },
    {
        icon: <Search size={28} />,
        title: "Tech Sourcing Consultation",
        description: "Need a specific gadget? We can find and source it for you, hassle-free.",
    }
];

export default function ServicesPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for Firestore submission
        toast({
            title: "Quote Request Sent!",
            description: "Thank you for your interest. We will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Services</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We offer a range of professional tech services to help your business grow.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {services.map((service, index) => (
                    <Card key={index} className="bg-card border hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                {service.icon}
                            </div>
                            <div>
                                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{service.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="max-w-3xl mx-auto border bg-secondary/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-foreground">Request a Quote</CardTitle>
                    <CardDescription>Have a project in mind? Fill out the form below and we'll get back to you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" required placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="service-type">Type of Service</Label>
                            <select id="service-type" name="service-type" required className="w-full p-2.5 rounded-md border border-input bg-background text-base focus:ring-primary focus:border-primary">
                                <option value="" disabled selected>Select a service...</option>
                                <option value="web-design">Web Design</option>
                                <option value="branding">Branding & Logo</option>
                                <option value="automation">Social Media Automation</option>
                                <option value="print">Print Design</option>
                                <option value="sourcing">Tech Sourcing</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" required placeholder="Tell us about your project..." className="min-h-[120px]" />
                        </div>
                        <div className="text-center">
                            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-primary-foreground">
                                <Send className="mr-2 h-5 w-5"/>
                                Send Request
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
