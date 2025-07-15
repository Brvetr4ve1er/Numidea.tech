
'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShoppingCart, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

const products = [
    { 
      name: "Note 10", 
      price: "35,000 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "tablet computer",
      specs: { RAM: "4GB", Screen: '10.1" HD', Battery: "8000mAh", Android: "12" },
      colors: ["Black", "Silver"],
      warranty: "12-Month Local Warranty"
    },
    { 
      name: "Note 12", 
      price: "55,000 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "professional tablet",
      specs: { RAM: "8GB", Screen: '12" AMOLED', Battery: "10,000mAh", Android: "13" },
      colors: ["Graphite", "Mystic Blue"],
      warranty: "12-Month Local Warranty"
    },
    { 
      name: "P55", 
      price: "28,000 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "smartphone android",
      specs: { RAM: "6GB", Screen: '6.7" FHD+', Battery: "5000mAh", Android: "13" },
      colors: ["Ocean Blue", "Matte Black"],
      warranty: "12-Month Local Warranty"
    },
    { 
      name: "P10", 
      price: "19,500 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "budget smartphone",
      specs: { RAM: "4GB", Screen: '6.5"', Battery: "5000mAh", Android: "12 Go" },
      colors: ["Green", "Grey"],
      warranty: "12-Month Local Warranty"
    },
    { 
      name: "Kids Tablet Pro", 
      price: "24,000 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "kids tablet colorful",
      specs: { RAM: "3GB", Screen: '8" HD', Battery: "6000mAh", Android: "12 Kids Mode" },
      colors: ["Blue", "Pink", "Yellow"],
      warranty: "12-Month Local Warranty"
    },
    { 
      name: "WiseTech Headphones", 
      price: "4,500 DZD", 
      imageUrl: "https://placehold.co/400x400.png", 
      aiHint: "wireless headphones",
      specs: { Type: "Over-ear", "Connection": "Bluetooth 5.2", Battery: "40 hours", "Features": "ANC" },
      colors: ["Black", "White"],
      warranty: "6-Month Warranty"
    },
];

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const [open, setOpen] = React.useState(false);

  return (
     <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Card className="bg-card rounded-lg shadow-sm overflow-hidden flex flex-col group cursor-pointer border hover:shadow-lg transition-all duration-300">
          <CardHeader className="p-0">
            <div className="aspect-square relative overflow-hidden">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                layout="fill" 
                objectFit="cover"
                className="group-hover:scale-105 transition-transform"
                data-ai-hint={product.aiHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
            <p className="text-xl font-bold text-primary">{product.price}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
             <Button className="w-full" variant="outline">View Details</Button>
          </CardFooter>
        </Card>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <Dialog.Title className="text-2xl font-bold text-foreground">{product.name}</Dialog.Title>
          <div className="grid md:grid-cols-2 gap-4">
            <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="rounded-lg w-full" data-ai-hint={product.aiHint} />
            <div>
              <h4 className="font-semibold text-lg mb-2">Specifications</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-2">Colors</h4>
              <div className="flex gap-2">
                {product.colors.map(color => (
                    <span key={color} className="px-3 py-1 text-sm rounded-full border bg-secondary">{color}</span>
                ))}
              </div>
          </div>
           <div>
              <h4 className="font-semibold text-lg mb-2">Warranty</h4>
              <p className="text-sm text-muted-foreground">{product.warranty}</p>
          </div>
          <Dialog.Footer className="sm:justify-start">
             <Button type="button" className="w-full sm:w-auto bg-primary text-primary-foreground">
                <ShoppingCart size={18} className="mr-2" /> Add to Cart
              </Button>
          </Dialog.Footer>
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


export default function StorePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of curated tech gadgets. Find your next favorite.
        </p>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input 
            type="search" 
            placeholder="Search products by name or tag..." 
            className="pl-10 text-base py-3 h-11 rounded-lg" 
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Button variant="outline" className="text-base py-3 h-11 rounded-lg">
          <Filter size={18} className="mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
}
