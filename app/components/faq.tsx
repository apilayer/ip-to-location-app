"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    number: string;
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const FAQItem = ({ number, title, children, isOpen, onToggle }: FAQItemProps) => {
    return (
        <div className="flex flex-col">
            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center justify-between w-full p-4 text-left",
                    "hover:bg-accent/50 transition-colors"
                )}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <span className="text-lg font-medium w-6">{number}</span>
                    <span className="text-lg">{title}</span>
                </div>
                {isOpen ? <X className="h-6 w-6 shrink-0" /> : <Plus className="h-6 w-6 shrink-0" />}
            </button>
            {isOpen && <div className="px-4 pb-4 pt-0 text-gray-300">{children}</div>}
        </div>
    );
};

interface FAQProps {
    items: {
        id: string;
        number: string;
        title: string;
        content: string;
    }[];
}

export function FAQ({ items }: FAQProps) {
    const [openItem, setOpenItem] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <div className="w-full m-auto mt-12 max-w-[686px] divide-y rounded-lg text-white">
            {items.map((item) => (
                <FAQItem
                    key={item.id}
                    number={item.number}
                    title={item.title}
                    isOpen={openItem === item.id}
                    onToggle={() => handleToggle(item.id)}
                >
                    {item.content}
                </FAQItem>
            ))}
        </div>
    );
}
