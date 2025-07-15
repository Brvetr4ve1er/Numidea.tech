
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Instagram, MapPin, Send, MessageCircle } from "lucide-react";

const socialLinks = [
    {
        icon: <MessageCircle size={28} />,
        name: "WhatsApp",
        handle: "+213 123 456 789",
        url: "https://wa.me/213123456789",
        cta: "Chat with us"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
        name: "Facebook",
        handle: "@StickyTechDZ",
        url: "#",
        cta: "Follow us"
    },
    {
        icon: <Instagram size={28} />,
        name: "Instagram",
        handle: "@StickyTechDZ",
        url: "#",
        cta: "Follow us"
    },
];

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for form submission logic
        toast({
            title: "Message Sent!",
            description: "Thank you for reaching out. We will get back to you soon.",
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Get In Touch</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We're here to help! Whether you have a question about a product or a project in mind, feel free to reach out.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info & Socials */}
                <div className="lg:col-span-1 space-y-8">
                    {socialLinks.map((link) => (
                        <Card key={link.name} className="border">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="text-primary">{link.icon}</div>
                                <div>
                                    <CardTitle className="text-lg">{link.name}</CardTitle>
                                    <CardDescription>{link.handle}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.cta}</a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                     <Card className="border">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                             <div className="text-primary"><MapPin size={28} /></div>
                             <div>
                                <CardTitle className="text-lg">Our Location</CardTitle>
                                <CardDescription>Algiers, Algeria</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204553.79979402513!2d2.959922896561022!3d36.75841315904832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad614b533d31%3A0x33893a4e934c264!2sAlgiers!5e0!3m2!1sen!2sdz!4v1677610014001!5m2!1sen!2sdz" 
                                    width="100%" 
                                    height="100%" 
                                    style={{border:0}} 
                                    allowFullScreen={false} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="h-full border">
                         <CardHeader>
                            <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                            <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" required placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" type="tel" required placeholder="0550 12 34 56" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" name="message" required placeholder="Your question or message..." className="min-h-[150px]" />
                                </div>
                                <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-primary-foreground">
                                    <Send className="mr-2 h-5 w-5"/>
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
