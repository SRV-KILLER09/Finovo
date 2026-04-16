
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Github, Linkedin, Twitter, User } from "lucide-react";

const developers = [
    {
        name: "Vardaan Saxena",
        role: "Project Lead & Full-Stack",
        avatarId: "dev1",
    },
    {
        name: "Dev Goti",
        role: "Frontend Architect",
        avatarId: "dev2",
    },
    {
        name: "Siddharth Singh",
        role: "UI/UX Designer",
        avatarId: "dev3",
    },
    {
        name: "Mihir Panchal",
        role: "AI & Backend Engineer",
        avatarId: "dev4",
    },
];

export default function DeveloperPage() {
    return (
        <div className="space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-bold font-headline text-primary">Meet the Team</h1>
                <p className="text-muted-foreground text-lg">The minds behind Finovo, dedicated to empowering student finance.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {developers.map(dev => {
                    const avatar = PlaceHolderImages.find(img => img.id === dev.avatarId);
                    return (
                        <Card key={dev.name} className="text-center group hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                            <CardContent className="p-6">
                                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary transition-colors">
                                    <AvatarImage src={avatar?.imageUrl} alt={dev.name} data-ai-hint={avatar?.imageHint} />
                                    <AvatarFallback><User size={60}/></AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold font-headline">{dev.name}</h2>
                                <p className="text-primary font-medium">{dev.role}</p>
                                <div className="flex justify-center gap-4 mt-4 text-muted-foreground">
                                    <Github className="h-5 w-5 hover:text-primary transition-colors cursor-pointer"/>
                                    <Linkedin className="h-5 w-5 hover:text-primary transition-colors cursor-pointer"/>
                                    <Twitter className="h-5 w-5 hover:text-primary transition-colors cursor-pointer"/>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
